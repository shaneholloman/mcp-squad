import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getUserContext } from "./helpers/getUser.js";
import { knowledgeTools, runKnowledgeTool } from "./knowledge.js";
import { opportunityTools, runOpportunityTool } from "./opportunity.js";
import { outcomeTools, runOutcomeTool } from "./outcomes.js";
import { requirementTools, runRequirementTool } from "./requirements.js";
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

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      ...opportunityTools,
      ...solutionTools,
      ...outcomeTools,
      ...requirementTools,
      ...knowledgeTools,
      ...workspaceTool,
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async request => {
  try {
    const { name, arguments: args } = request.params;
    const userContext = await getUserContext();

    const runners = [
      runWorkspaceTool,
      runKnowledgeTool,
      runSolutionTool,
      runOpportunityTool,
      runOutcomeTool,
      runRequirementTool,
    ];

    const runner = runners.find(
      possibleRunner => possibleRunner(name) !== null,
    )?.(name);

    if (runner !== null && runner !== undefined) {
      return await runner(userContext, args);
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("error", error);
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Secure MCP Filesystem Server running on stdio");
}

runServer().catch(error => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
