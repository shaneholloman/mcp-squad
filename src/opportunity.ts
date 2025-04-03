import { z } from "zod";
import { squadClient } from "./lib/clients/squad.js";
import { UserContext } from "./helpers/getUser.js";
import { ManageOpportunityRelationshipsRequest, RelationshipAction, UpdateOpportunityPayload, UpdateOpportunityPayloadStatusEnum } from "./lib/openapi/squad/models/index.js";
import { zodToJsonSchema } from "zod-to-json-schema";

// Schema definitions
export const CreateOpportunityArgsSchema = z.object({
  title: z.string().describe("A short title"),
  description: z.string().describe("A short description of the opportunity, detailing the problem statement and opportunity for the business"),
});

export const createOpportunityTool = {
    name: "create_opportunity",
    description: "Create a new opportunity. An opportunity is a detailed problem statement identified for the organisation. It doesn't have any solutionising and simply captures an opportunity for the organisation.",
    inputSchema: zodToJsonSchema(CreateOpportunityArgsSchema),
};

export const createOpportunity = (context: UserContext) => async ({
    title,
    description
}: z.infer<typeof CreateOpportunityArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const res = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesPost({
            orgId,
            workspaceId,
            createOpportunityPayload: {
                title,
                description,
                status: "New"
            }
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify(res, null, 2),
            }],
        }
    } catch (e) {
        console.error("error", e)
        throw e;
    }
};

// Schema for listing opportunities
export const ListOpportunitiesArgsSchema = z.object({});

export const listOpportunitiesTool = {
    name: "list_opportunities",
    description: "List all opportunities in the workspace. Opportunities are problem statements identified for the organisation.",
    inputSchema: zodToJsonSchema(ListOpportunitiesArgsSchema),
};

export const listOpportunities = (context: UserContext) => async (
    _args: z.infer<typeof ListOpportunitiesArgsSchema>
): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const opportunities = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesGet({
            orgId,
            workspaceId
        });

        if (opportunities.length === 0) {
            return {
                content: [{
                    type: "text",
                    text: "No opportunities found."
                }]
            };
        }

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    opportunities,
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for getting a single opportunity
export const GetOpportunityArgsSchema = z.object({
    opportunityId: z.string().describe("The ID of the opportunity to retrieve"),
});

export const getOpportunityTool = {
    name: "get_opportunity",
    description: "Get details of a specific opportunity by ID. Opportunities are problem statements identified for the organisation.",
    inputSchema: zodToJsonSchema(GetOpportunityArgsSchema),
};

export const getOpportunity = (context: UserContext) => async ({
    opportunityId
}: z.infer<typeof GetOpportunityArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const opportunity = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesOpportunityIdGet({
            orgId,
            workspaceId,
            opportunityId,
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify(opportunity, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for updating an opportunity
export const UpdateOpportunityArgsSchema = z.object({
    opportunityId: z.string().describe("The ID of the opportunity to update"),
    title: z.string().optional().describe("Updated title"),
    description: z.string().optional().describe("Updated description"),
    status: z.enum([
        UpdateOpportunityPayloadStatusEnum.New,
        UpdateOpportunityPayloadStatusEnum.Solved,
        UpdateOpportunityPayloadStatusEnum.Planned,
        UpdateOpportunityPayloadStatusEnum.InProgress
    ]).optional().describe(`Updated status: ${UpdateOpportunityPayloadStatusEnum.New} hasn't been developed, ${UpdateOpportunityPayloadStatusEnum.InProgress} means we're currently building out solutions and implementing them. ${UpdateOpportunityPayloadStatusEnum.Planned} means we've finished developing the solutions and are ready to implement them. ${UpdateOpportunityPayloadStatusEnum.Solved} means we've completed the implementation and the opportunity is considered addressed.`),
});

export const updateOpportunityTool = {
    name: "update_opportunity",
    description: "Update an existing opportunity's details such as title, description, or status.",
    inputSchema: zodToJsonSchema(UpdateOpportunityArgsSchema),
};

export const updateOpportunity = (context: UserContext) => async ({
    opportunityId,
    title,
    description,
    status
}: z.infer<typeof UpdateOpportunityArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const updatePayload: UpdateOpportunityPayload = {};
        if (title !== undefined) updatePayload.title = title;
        if (description !== undefined) updatePayload.description = description;
        if (status !== undefined) updatePayload.status = status;

        const opportunity = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesOpportunityIdPut({
            orgId,
            workspaceId,
            opportunityId,
            updateOpportunityPayload: updatePayload
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify(opportunity, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for deleting an opportunity
export const DeleteOpportunityArgsSchema = z.object({
    opportunityId: z.string().describe("The ID of the opportunity to delete"),
});

export const deleteOpportunityTool = {
    name: "delete_opportunity",
    description: "Delete an opportunity by ID.",
    inputSchema: zodToJsonSchema(DeleteOpportunityArgsSchema),
};

export const deleteOpportunity = (context: UserContext) => async ({
    opportunityId
}: z.infer<typeof DeleteOpportunityArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const result = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesOpportunityIdDelete({
            orgId,
            workspaceId,
            opportunityId
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    opportunityId
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for generating solutions for an opportunity
export const GenerateSolutionsArgsSchema = z.object({
    opportunityId: z.string().describe("The ID of the opportunity to generate solutions for"),
    prompt: z.string().optional().describe("Optional prompt to guide solution generation"),
});

export const generateSolutionsTool = {
    name: "generate_solutions",
    description: "Start the process of generating solutions for an opportunity.",
    inputSchema: zodToJsonSchema(GenerateSolutionsArgsSchema),
};

export const generateSolutions = (context: UserContext) => async ({
    opportunityId,
    prompt
}: z.infer<typeof GenerateSolutionsArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesOpportunityIdGenerateSolutionsPost({
            orgId,
            workspaceId,
            opportunityId,
            organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesOpportunityIdGenerateSolutionsPostRequest: prompt ? {} : undefined
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    opportunityId
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for managing opportunity relationships
export const ManageOpportunityRelationshipsArgsSchema = z.object({
    opportunityId: z.string().describe("The ID of the opportunity to manage relationships for"),
    action: z.enum(["add", "remove"]).describe("Whether to add or remove the relationships"),
    solutionIds: z.array(z.string()).optional().describe("IDs of solutions to relate to this opportunity"),
    outcomeIds: z.array(z.string()).optional().describe("IDs of outcomes to relate to this opportunity"),
    feedbackIds: z.array(z.string()).optional().describe("IDs of feedback items to relate to this opportunity"),
});

export const manageOpportunityRelationshipsTool = {
    name: "manage_opportunity_relationships",
    description: "Add or remove relationships between an opportunity and other entities (solutions, outcomes, or feedback).",
    inputSchema: zodToJsonSchema(ManageOpportunityRelationshipsArgsSchema),
};

export const manageOpportunityRelationships = (context: UserContext) => async ({
    opportunityId,
    action,
    solutionIds,
    outcomeIds,
    feedbackIds
}: z.infer<typeof ManageOpportunityRelationshipsArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const relationshipsPayload: ManageOpportunityRelationshipsRequest = {
            solutionIds: solutionIds || [], 
            outcomeIds: outcomeIds || [],   
            feedbackIds: feedbackIds || []  
        };

        await squadClient().manageOpportunityRelationships({
            orgId,
            workspaceId,
            opportunityId,
            action: action as RelationshipAction,
            manageOpportunityRelationshipsRequest: relationshipsPayload
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    opportunityId,
                    action,
                    solutionIds,
                    outcomeIds,
                    feedbackIds
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};