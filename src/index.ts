import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { feedbackTools, runFeedbackTool } from "./feedback.js";
import { getUserContext } from "./helpers/getUser.js";
import { knowledgeTools, runKnowledgeTool } from "./knowledge.js";
import { opportunityTools, runOpportunityTool } from "./opportunity.js";
import { outcomeTools, runOutcomeTool } from "./outcomes.js";
import {
  runSimilaritySearchTool,
  similaritySearchTools,
} from "./similarity-search.js";
import { runSolutionTool, solutionTools } from "./solutions.js";
import { runWorkspaceTool, workspaceTool } from "./workspace.js";

// Server setup
const server = new Server(
  {
    name: "meet-squad",
    version: "0.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Log all available tools
const allTools = [
  ...opportunityTools,
  ...solutionTools,
  ...outcomeTools,
  ...knowledgeTools,
  ...workspaceTool,
  ...feedbackTools,
  ...similaritySearchTools,
];

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolsResponse = {
    tools: allTools.map(tool => ({
      ...tool,
      inputSchema: zodToJsonSchema(tool.inputSchema),
    })),
  };

  return toolsResponse;
});

server.setRequestHandler(CallToolRequestSchema, async request => {
  const startTime = Date.now();
  try {
    const { name, arguments: args } = request.params;

    const userContext = await getUserContext();

    const runners = [
      runWorkspaceTool,
      runKnowledgeTool,
      runSolutionTool,
      runOpportunityTool,
      runOutcomeTool,
      runFeedbackTool,
      runSimilaritySearchTool,
    ];

    const runner = runners.find(
      possibleRunner => possibleRunner(name) !== null,
    )?.(name);

    if (runner !== null && runner !== undefined) {
      const result = await runner(userContext, args);
      const executionTime = Date.now() - startTime;

      return result;
    }

    console.error(`[squad-mcp:server:error] Unknown tool: ${name}`);
    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const executionTime = Date.now() - startTime;
    console.error(
      `[squad-mcp:server:error] Tool execution failed after ${executionTime}ms`,
    );
    console.error(`[squad-mcp:server:error] Error details:`, error);
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start server
async function runServer() {
  const transport = new StdioServerTransport();

  try {
    await server.connect(transport);
  } catch (error) {
    console.error(
      "[squad-mcp:server:error] Failed to connect server to transport:",
      error,
    );
    throw error;
  }
}

runServer().catch(error => {
  console.error("[squad-mcp:server:fatal] Fatal error running server:", error);
  process.exit(1);
});
