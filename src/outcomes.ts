import { z } from "zod";
import { squadClient } from "./lib/clients/squad.js";
import { UserContext } from "./helpers/getUser.js";
import { RelationshipAction, CreateOutcomePayload, OutcomeRelationshipsPayload, UpdateOutcomePayload } from "./lib/openapi/squad/models/index.js";
import { zodToJsonSchema } from "zod-to-json-schema";

// Schema definitions
export const CreateOutcomeArgsSchema = z.object({
  title: z.string().describe("A short title for the outcome"),
  description: z.string().describe("A detailed description of the outcome"),
  priority: z.number().optional().describe("Priority level of the outcome (numeric)"),
  trend: z.number().optional().describe("Trend indicator for the outcome (numeric)"),
  analyticEvents: z.array(z.string()).optional().describe("List of analytic events associated with the outcome"),
  hideContent: z.boolean().optional().describe("Whether the outcome content should be hidden"),
  ownerId: z.string().optional().describe("ID of the outcome owner"),
});

export const createOutcomeTool = {
    name: "create_outcome",
    description: "Create a new outcome. An outcome is a business objective or goal that the organization aims to achieve.",
    inputSchema: zodToJsonSchema(CreateOutcomeArgsSchema),
};

export const createOutcome = (context: UserContext) => async ({
    title,
    description,
    priority,
    trend,
    analyticEvents,
    hideContent,
    ownerId
}: z.infer<typeof CreateOutcomeArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        // Creating with required defaults for any missing fields
        const outcomeRequest: CreateOutcomePayload = {
            title,
            description,
            priority: priority !== undefined ? priority : 0,
            trend: trend !== undefined ? trend : 0,
            analyticEvents: analyticEvents !== undefined ? analyticEvents : [],
        };
        
        // Only add ownerId if it's defined, since it's truly optional
        if (ownerId !== undefined) outcomeRequest.ownerId = ownerId;

        const res = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOutcomesPost({
            orgId,
            workspaceId,
            createOutcomePayload: outcomeRequest
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
}

// Schema for listing outcomes
export const ListOutcomesArgsSchema = z.object({});

export const listOutcomesTool = {
    name: "list_outcomes",
    description: "List all outcomes in the workspace. Outcomes are business objectives or goals that the organization aims to achieve.",
    inputSchema: zodToJsonSchema(ListOutcomesArgsSchema),
};

export const listOutcomes = (context: UserContext) => async (
    _args: z.infer<typeof ListOutcomesArgsSchema>
): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const outcomes = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOutcomesGet({
            orgId,
            workspaceId,
        });

        if (outcomes.data.length === 0) {
            return {
                content: [{
                    type: "text",
                    text: "No outcomes found."
                }]
            };
        }

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    outcomes,
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for getting a single outcome
export const GetOutcomeArgsSchema = z.object({
    outcomeId: z.string().describe("The ID of the outcome to retrieve"),
    relationships: z.array(z.enum(["opportunities", "solutions", "requirements", "feedback"]))
        .optional()
        .describe("Relationships to include in the response. Opportunities are problem statements identified for the organisation. Solutions are proposed approaches to address opportunities. Requirements are detailed steps to implement a solution. Feedback is additional information or insights related to the opportunity.")
        .default([]),
});

export const getOutcomeTool = {
    name: "get_outcome",
    description: "Get details of a specific outcome by ID. Outcomes are business objectives or goals that the organization aims to achieve.",
    inputSchema: zodToJsonSchema(GetOutcomeArgsSchema),
};

export const getOutcome = (context: UserContext) => async ({
    outcomeId,
    relationships
}: z.infer<typeof GetOutcomeArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const outcome = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOutcomesOutcomeIdGet({
            orgId,
            workspaceId,
            outcomeId,
            relationships: relationships.join(",")
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify(outcome, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for updating an outcome
export const UpdateOutcomeArgsSchema = z.object({
    outcomeId: z.string().describe("The ID of the outcome to update"),
    title: z.string().optional().describe("Updated title"),
    description: z.string().optional().describe("Updated description"),
    priority: z.number().optional().describe("Updated priority level"),
    trend: z.number().optional().describe("Updated trend indicator"),
    analyticEvents: z.array(z.string()).optional().describe("Updated list of analytic events"),
    hideContent: z.boolean().optional().describe("Whether the outcome content should be hidden"),
    ownerId: z.string().optional().describe("Updated ID of the outcome owner"),
});

export const updateOutcomeTool = {
    name: "update_outcome",
    description: "Update an existing outcome's details.",
    inputSchema: zodToJsonSchema(UpdateOutcomeArgsSchema),
};

export const updateOutcome = (context: UserContext) => async ({
    outcomeId,
    title,
    description,
    priority,
    trend, 
    analyticEvents,
    hideContent,
    ownerId
}: z.infer<typeof UpdateOutcomeArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        // First, get the existing outcome to preserve any values we're not updating
        const existingOutcome = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOutcomesOutcomeIdGet({
            orgId,
            workspaceId,
            outcomeId
        });

        // Create update payload with required fields and defaults
        const updatePayload: UpdateOutcomePayload = {
            title: title || existingOutcome.data.title,
            description: description || existingOutcome.data.description,
            priority: priority !== undefined ? priority : (existingOutcome.data.priority || 0),
            trend: trend !== undefined ? trend : (existingOutcome.data.trend || 0),
            analyticEvents: analyticEvents || existingOutcome.data.analyticEvents || [],
        };
        
        // Only add ownerId if it's defined in the update or existing outcome
        if (ownerId !== undefined || existingOutcome.data.ownerId) {
            updatePayload.ownerId = ownerId || existingOutcome.data.ownerId;
        }

        const outcome = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOutcomesOutcomeIdPut({
            orgId,
            workspaceId,
            outcomeId,
            updateOutcomePayload: updatePayload
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify(outcome, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for deleting an outcome
export const DeleteOutcomeArgsSchema = z.object({
    outcomeId: z.string().describe("The ID of the outcome to delete"),
});

export const deleteOutcomeTool = {
    name: "delete_outcome",
    description: "Delete an outcome by ID.",
    inputSchema: zodToJsonSchema(DeleteOutcomeArgsSchema),
};

export const deleteOutcome = (context: UserContext) => async ({
    outcomeId
}: z.infer<typeof DeleteOutcomeArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const result = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOutcomesOutcomeIdDelete({
            orgId,
            workspaceId,
            outcomeId
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    outcomeId
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for managing outcome relationships
export const ManageOutcomeRelationshipsArgsSchema = z.object({
    outcomeId: z.string().describe("The ID of the outcome to manage relationships for"),
    action: z.enum(["add", "remove"]).describe("Whether to add or remove the relationships"),
    opportunityIds: z.array(z.string()).optional().describe("IDs of opportunities to relate to this outcome"),
    solutionIds: z.array(z.string()).optional().describe("IDs of solutions to relate to this outcome"),
    feedbackIds: z.array(z.string()).optional().describe("IDs of feedback items to relate to this outcome"),
});

export const manageOutcomeRelationshipsTool = {
    name: "manage_outcome_relationships",
    description: "Add or remove relationships between an outcome and other entities (opportunities, solutions, or feedback).",
    inputSchema: zodToJsonSchema(ManageOutcomeRelationshipsArgsSchema),
};

export const manageOutcomeRelationships = (context: UserContext) => async ({
    outcomeId,
    action,
    opportunityIds,
    solutionIds,
    feedbackIds
}: z.infer<typeof ManageOutcomeRelationshipsArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const relationshipsPayload: OutcomeRelationshipsPayload = {
            opportunityIds: opportunityIds || [],
        };

        await squadClient().manageOutcomeRelationships({
            orgId,
            workspaceId,
            outcomeId,
            action: action as RelationshipAction,
            outcomeRelationshipsPayload: relationshipsPayload
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    outcomeId,
                    action,
                    opportunityIds,
                    solutionIds,
                    feedbackIds
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};
