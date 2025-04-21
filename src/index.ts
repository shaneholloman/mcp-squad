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
import {
  createOutcome, CreateOutcomeArgsSchema,
  listOutcomes, ListOutcomesArgsSchema,
  getOutcome, GetOutcomeArgsSchema,
  updateOutcome, UpdateOutcomeArgsSchema,
  deleteOutcome, DeleteOutcomeArgsSchema,
  manageOutcomeRelationships, ManageOutcomeRelationshipsArgsSchema,
  createOutcomeTool,
  listOutcomesTool,
  getOutcomeTool,
  updateOutcomeTool,
  deleteOutcomeTool,
  manageOutcomeRelationshipsTool
} from "./outcomes.js";
import {
  createRequirement, CreateRequirementArgsSchema,
  listRequirements, ListRequirementsArgsSchema,
  getRequirement, GetRequirementArgsSchema,
  updateRequirement, updateRequirementArgsSchema,
  deleteRequirement, DeleteRequirementArgsSchema,
  manageRequirementRelationships, ManageRequirementRelationshipsArgsSchema,
  createRequirementTool,
  listRequirementsTool,
  getRequirementTool,
  updateRequirementTool,
  deleteRequirementTool,
  manageRequirementRelationshipsTool
} from "./requirements.js";
import { getUserContext } from "./helpers/getUser.js";
import { createKnowledgeTool, listKnowledgeTool, getKnowledgeTool, deleteKnowledgeTool, createKnowledge, CreateKnowledgeArgsSchema, deleteKnowledge, DeleteKnowledgeArgsSchema, getKnowledge, GetKnowledgeArgsSchema, listKnowledge, ListKnowledgeArgsSchema } from "./knowledge.js";
import { getWorkspaceTool, updateWorkspaceTool, getWorkspace, GetWorkspaceArgsSchema, updateWorkspace, UpdateWorkspaceArgsSchema } from "./workspace.js";

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
      
      // Outcome tools
      createOutcomeTool,
      listOutcomesTool,
      getOutcomeTool,
      updateOutcomeTool,
      deleteOutcomeTool,
      manageOutcomeRelationshipsTool,
      
      // Requirement tools
      createRequirementTool,
      listRequirementsTool,
      getRequirementTool,
      updateRequirementTool,
      deleteRequirementTool,
      manageRequirementRelationshipsTool,

      // Knowledge tools
      createKnowledgeTool,
      listKnowledgeTool,
      getKnowledgeTool,
      deleteKnowledgeTool,

      // Workspace tools
      getWorkspaceTool,
      updateWorkspaceTool,
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
      
      // Outcome handlers
      case "create_outcome": {
        try {
            const validArgs = CreateOutcomeArgsSchema.parse(args);
            return await createOutcome(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to create this outcome. Please check back later."}
                ]
            }
        }
      }
      case "list_outcomes": {
        try {
            const validArgs = ListOutcomesArgsSchema.parse(args);
            return await listOutcomes(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to list outcomes. Please check back later."}
                ]
            }
        }
      }
      case "get_outcome": {
        try {
            const validArgs = GetOutcomeArgsSchema.parse(args);
            return await getOutcome(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to retrieve this outcome. Please check that the ID is correct."}
                ]
            }
        }
      }
      case "update_outcome": {
        try {
            const validArgs = UpdateOutcomeArgsSchema.parse(args);
            return await updateOutcome(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to update this outcome. Please check that the ID is correct and all values are valid."}
                ]
            }
        }
      }
      case "delete_outcome": {
        try {
            const validArgs = DeleteOutcomeArgsSchema.parse(args);
            return await deleteOutcome(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to delete this outcome. Please check that the ID is correct."}
                ]
            }
        }
      }
      case "manage_outcome_relationships": {
        try {
            const validArgs = ManageOutcomeRelationshipsArgsSchema.parse(args);
            return await manageOutcomeRelationships(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to manage relationships for this outcome. Please check that all IDs are correct."}
                ]
            }
        }
      }
      
      // Requirement handlers
      case "create_requirement": {
        try {
            const validArgs = CreateRequirementArgsSchema.parse(args);
            return await createRequirement(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to create this requirement. Please check back later."}
                ]
            }
        }
      }
      case "list_requirements": {
        try {
            const validArgs = ListRequirementsArgsSchema.parse(args);
            return await listRequirements(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to list requirements. Please check back later."}
                ]
            }
        }
      }
      case "get_requirement": {
        try {
            const validArgs = GetRequirementArgsSchema.parse(args);
            return await getRequirement(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to retrieve this requirement. Please check that the ID is correct."}
                ]
            }
        }
      }
      case "update_requirement": {
        try {
            const validArgs = updateRequirementArgsSchema.parse(args);
            return await updateRequirement(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to update this requirement. Please check that the ID is correct and all values are valid."}
                ]
            }
        }
      }
      case "delete_requirement": {
        try {
            const validArgs = DeleteRequirementArgsSchema.parse(args);
            return await deleteRequirement(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to delete this requirement. Please check that the ID is correct."}
                ]
            }
        }
      }
      case "manage_requirement_relationships": {
        try {
            const validArgs = ManageRequirementRelationshipsArgsSchema.parse(args);
            return await manageRequirementRelationships(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to manage relationships for this requirement. Please check that all IDs are correct."}
                ]
            }
        }
      }

      // Knowledge handlers
      case "create_knowledge": {
        try {
            const validArgs = CreateKnowledgeArgsSchema.parse(args);
            return await createKnowledge(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to create this knowledge entry. Please check back later."}
                ]
            }
        }
      }
      case "list_knowledge": {
        try {
            const validArgs = ListKnowledgeArgsSchema.parse(args);
            return await listKnowledge(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to list knowledge entries. Please check back later."}
                ]
            }
        }
      }
      case "get_knowledge": {
        try {
            const validArgs = GetKnowledgeArgsSchema.parse(args);
            return await getKnowledge(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to retrieve this knowledge entry. Please check that the ID is correct."}
                ]
            }
        }
      }
      case "delete_knowledge": {
        try {
            const validArgs = DeleteKnowledgeArgsSchema.parse(args);
            return await deleteKnowledge(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to delete this knowledge entry. Please check that the ID is correct."}
                ]
            }
        }
      }

      // Workspace handlers
      case "get_workspace": {
        try {
            const validArgs = GetWorkspaceArgsSchema.parse(args);
            return await getWorkspace(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to retrieve this workspace. Please check that the ID is correct."}
                ]
            }
        }
      }
      case "update_workspace": {
        try {
            const validArgs = UpdateWorkspaceArgsSchema.parse(args);
            return await updateWorkspace(userContext)(validArgs);
        } catch (e) {
            return {
                content: [
                    { type: "text", "text": "I was unable to update this workspace. Please check that the ID is correct."}
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