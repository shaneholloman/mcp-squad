#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Schema definitions
const CreateOpportunityArgsSchema = z.object({
  title: z.string().describe("A short title"),
  description: z.string().describe("A short description of the opportunity, detailing the problem statement and opportunity for the business"),
});

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

    switch (name) {
      case "create_opportunity": {
        return {
          content: [{ type: "text", text: "Sent to squADS" }],
        };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
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