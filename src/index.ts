import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { 
  createOpportunity, CreateOpportunityArgsSchema,
  listOpportunities, ListOpportunitiesArgsSchema,
  getOpportunity, GetOpportunityArgsSchema,
  updateOpportunity, UpdateOpportunityArgsSchema,
  deleteOpportunity, DeleteOpportunityArgsSchema,
  generateSolutions, GenerateSolutionsArgsSchema,
  manageOpportunityRelationships, ManageOpportunityRelationshipsArgsSchema,
  createOpportunityTool,
  listOpportunitiesTool,
  getOpportunityTool,
  updateOpportunityTool,
  deleteOpportunityTool,
  generateSolutionsTool,
  manageOpportunityRelationshipsTool
} from "./opportunity.js";
import {
  createSolution, CreateSolutionArgsSchema,
  listSolutions, ListSolutionsArgsSchema,
  getSolution, GetSolutionArgsSchema,
  updateSolution, UpdateSolutionArgsSchema,
  deleteSolution, DeleteSolutionArgsSchema,
  manageSolutionRelationships, ManageSolutionRelationshipsArgsSchema,
  createSolutionTool,
  listSolutionsTool,
  getSolutionTool,
  updateSolutionTool,
  deleteSolutionTool,
  manageSolutionRelationshipsTool
} from "./solutions.js";
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
      // Opportunity tools
      createOpportunityTool,
      listOpportunitiesTool,
      getOpportunityTool,
      updateOpportunityTool,
      deleteOpportunityTool,
      generateSolutionsTool,
      manageOpportunityRelationshipsTool,
      
      // Solution tools
      createSolutionTool,
      listSolutionsTool,
      getSolutionTool,
      updateSolutionTool,
      deleteSolutionTool,
      manageSolutionRelationshipsTool,
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    const userContext = await getUserContext();

    switch (name) {
      // Opportunity handlers
      case "create_opportunity": {
        try {
            // Parse and validate args using the schema
            const validArgs = CreateOpportunityArgsSchema.parse(args);

            return await createOpportunity(userContext)({
                title: validArgs.title,
                description: validArgs.description,
            })

        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to add this opportunity. Please check back later"}
                ]
            }
        }
      }
      case "list_opportunities": {
        try {
            // No args needed for listing
            const validArgs = ListOpportunitiesArgsSchema.parse(args);
            return await listOpportunities(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to list opportunities. Please check back later."}
                ]
            }
        }
      }
      case "get_opportunity": {
        try {
            const validArgs = GetOpportunityArgsSchema.parse(args);
            return await getOpportunity(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to retrieve this opportunity. Please check that the ID is correct."}
                ]
            }
        }
      }
      case "update_opportunity": {
        try {
            const validArgs = UpdateOpportunityArgsSchema.parse(args);
            return await updateOpportunity(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to update this opportunity. Please check that the ID is correct and all values are valid."}
                ]
            }
        }
      }
      case "delete_opportunity": {
        try {
            const validArgs = DeleteOpportunityArgsSchema.parse(args);
            return await deleteOpportunity(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to delete this opportunity. Please check that the ID is correct."}
                ]
            }
        }
      }
      case "generate_solutions": {
        try {
            const validArgs = GenerateSolutionsArgsSchema.parse(args);
            return await generateSolutions(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to generate solutions for this opportunity. Please check that the ID is correct."}
                ]
            }
        }
      }
      case "manage_opportunity_relationships": {
        try {
            const validArgs = ManageOpportunityRelationshipsArgsSchema.parse(args);
            return await manageOpportunityRelationships(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to manage relationships for this opportunity. Please check that all IDs are correct."}
                ]
            }
        }
      }

      // Solution handlers
      case "create_solution": {
        try {
            const validArgs = CreateSolutionArgsSchema.parse(args);
            return await createSolution(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to create this solution. Please check back later."}
                ]
            }
        }
      }
      case "list_solutions": {
        try {
            const validArgs = ListSolutionsArgsSchema.parse(args);
            return await listSolutions(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to list solutions. Please check back later."}
                ]
            }
        }
      }
      case "get_solution": {
        try {
            const validArgs = GetSolutionArgsSchema.parse(args);
            return await getSolution(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to retrieve this solution. Please check that the ID is correct."}
                ]
            }
        }
      }
      case "update_solution": {
        try {
            const validArgs = UpdateSolutionArgsSchema.parse(args);
            return await updateSolution(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to update this solution. Please check that the ID is correct and all values are valid."}
                ]
            }
        }
      }
      case "delete_solution": {
        try {
            const validArgs = DeleteSolutionArgsSchema.parse(args);
            return await deleteSolution(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to delete this solution. Please check that the ID is correct."}
                ]
            }
        }
      }
      case "manage_solution_relationships": {
        try {
            const validArgs = ManageSolutionRelationshipsArgsSchema.parse(args);
            return await manageSolutionRelationships(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to manage relationships for this solution. Please check that all IDs are correct."}
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