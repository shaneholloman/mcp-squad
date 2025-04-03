import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createOpportunity, CreateOpportunityArgsSchema } from "./opportunity.js"
import { getUserContext } from "./helpers/getUser.js";

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
      {
        name: "create_opportunity",
        description: "Create a new opportunity. An opportunity is a detailed problem statement identified for the organisation. It doesn't have any solutionising and simply captures an opportunity for the organisation.",
        inputSchema: zodToJsonSchema(CreateOpportunityArgsSchema),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    const userContext = await getUserContext();

    switch (name) {
      case "create_opportunity": {
        try {
            // Parse and validate args using the schema
            const validArgs = CreateOpportunityArgsSchema.parse(args);

            const res = await createOpportunity(userContext)({
                title: validArgs.title,
                description: validArgs.description,
            })

            return {
              content: [{ type: "text", text: `Title: ${res.title}\n${res.description}` }],
            };
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to add this opportunity. Please check back later"}
                ]
            }
        }
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("error", error)
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

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});