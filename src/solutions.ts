import { z } from "zod";
import { squadClient } from "./lib/clients/squad.js";
import { UserContext } from "./helpers/getUser.js";
import { 
    RelationshipAction, 
    OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequest,
    OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequestStatusEnum,
    OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequestCreatedByEnum,
    OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest,
    SolutionRelationshipsPayload 
} from "./lib/openapi/squad/models/index.js";
import { zodToJsonSchema } from "zod-to-json-schema";

const statusEnum = z.enum([
    OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequestStatusEnum.New,
    OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequestStatusEnum.Solved,
    OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequestStatusEnum.Planned,
    OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequestStatusEnum.InProgress
]).optional().describe(`Status of the solution: ${OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequestStatusEnum.New} hasn't been developed, ${OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequestStatusEnum.InProgress} means we're currently building out requirements and implementing them. ${OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequestStatusEnum.Planned} means we've finished developing the solutions and are ready to implement them. ${OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequestStatusEnum.Solved} means we've completed the implementation and the opportunity is considered addressed.`);

// Schema for creating a solution
export const CreateSolutionArgsSchema = z.object({
    title: z.string().describe("A short title for the solution"),
    description: z.string().describe("A description of the solution."),
    pros: z.array(z.string()).describe("List of pros/benefits of this solution. This is a sentence or two max."),
    cons: z.array(z.string()).describe("List of cons/drawbacks of this solution. This is a sentence or two max."),
    status: statusEnum,
});

export const createSolutionTool = {
    name: "create_solution",
    description: "Create a new solution. A solution is a proposed approach to address an opportunity. A solution will be a detailed plan to address an opportunity.",
    inputSchema: zodToJsonSchema(CreateSolutionArgsSchema),
};

export const createSolution = (context: UserContext) => async ({
    title,
    description,
    pros,
    cons,
    status
}: z.infer<typeof CreateSolutionArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const solutionPayload: OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequest = {
            title,
            description,
            pros,
            cons,
            status: status || OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequestStatusEnum.New,
            createdBy: OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequestCreatedByEnum.User
        };

        const solution = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdSolutionsPost({
            orgId,
            workspaceId,
            organisationsOrgIdWorkspacesWorkspaceIdSolutionsPostRequest: solutionPayload
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    solution,
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for listing solutions
export const ListSolutionsArgsSchema = z.object({});

export const listSolutionsTool = {
    name: "list_solutions",
    description: "List all solutions in the workspace. Solutions are proposed approaches to address opportunities.",
    inputSchema: zodToJsonSchema(ListSolutionsArgsSchema),
};

export const listSolutions = (context: UserContext) => async (
    _args: z.infer<typeof ListSolutionsArgsSchema>
): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const solutions = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdSolutionsGet({
            orgId,
            workspaceId
        });

        if (solutions.data.length === 0) {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        solutions: []
                    }, null, 2)
                }]
            };
        }

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    solutions,
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for getting a single solution
export const GetSolutionArgsSchema = z.object({
    solutionId: z.string().describe("The ID of the solution to retrieve"),
    relationships: z.array(z.enum(["opportunities", "requirements", "outcomes", "feedback"]))
        .optional()
        .describe("Relationships to include in the response. Opportunities are problem statements identified for the organisation. Outcomes are business objectives/goals. Requirements are detailed steps to implement a solution. Feedback is additional information or insights related to the opportunity.")
        .default([]),
});

export const getSolutionTool = {
    name: "get_solution",
    description: "Get details of a specific solution by ID.",
    inputSchema: zodToJsonSchema(GetSolutionArgsSchema),
};

export const getSolution = (context: UserContext) => async ({
    solutionId
}: z.infer<typeof GetSolutionArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const solution = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdGet({
            orgId,
            workspaceId,
            solutionId
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    solution
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for updating a solution
export const UpdateSolutionArgsSchema = z.object({
    solutionId: z.string().describe("The ID of the solution to update"),
    title: z.string().optional().describe("Updated title"),
    description: z.string().optional().describe("Updated description"),
    pros: z.array(z.string()).optional().describe("Updated list of pros/benefits"),
    cons: z.array(z.string()).optional().describe("Updated list of cons/drawbacks"),
    status: statusEnum,
});

export const updateSolutionTool = {
    name: "update_solution",
    description: "Update an existing solution's details such as title, description, pros, cons, or status.",
    inputSchema: zodToJsonSchema(UpdateSolutionArgsSchema),
};

export const updateSolution = (context: UserContext) => async ({
    solutionId,
    title,
    description,
    pros,
    cons,
    status
}: z.infer<typeof UpdateSolutionArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        // First, get the existing solution to preserve any values we're not updating
        const existingSolution = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdGet({
            orgId,
            workspaceId,
            solutionId
        });

        const updatePayload: OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest = {
            title: title || existingSolution.data.title,
            description: description || existingSolution.data.description,
            pros: pros || existingSolution.data.pros,
            cons: cons || existingSolution.data.cons,
            status: status || existingSolution.data.status
        };

        const solution = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPut({
            orgId,
            workspaceId,
            solutionId,
            organisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest: updatePayload
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    solution
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for deleting a solution
export const DeleteSolutionArgsSchema = z.object({
    solutionId: z.string().describe("The ID of the solution to delete"),
});

export const deleteSolutionTool = {
    name: "delete_solution",
    description: "Delete a solution by ID.",
    inputSchema: zodToJsonSchema(DeleteSolutionArgsSchema),
};

export const deleteSolution = (context: UserContext) => async ({
    solutionId
}: z.infer<typeof DeleteSolutionArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const result = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdDelete({
            orgId,
            workspaceId,
            solutionId
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    solutionId
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for managing solution relationships
export const ManageSolutionRelationshipsArgsSchema = z.object({
    solutionId: z.string().describe("The ID of the solution to manage relationships for"),
    action: z.enum(["add", "remove"]).describe("Whether to add or remove the relationships"),
    opportunityIds: z.array(z.string()).optional().describe("IDs of opportunities to relate to this solution"),
    outcomeIds: z.array(z.string()).optional().describe("IDs of outcomes to relate to this solution"),
    feedbackIds: z.array(z.string()).optional().describe("IDs of feedback items to relate to this solution"),
});

export const manageSolutionRelationshipsTool = {
    name: "manage_solution_relationships",
    description: "Add or remove relationships between a solution and other entities (opportunities, outcomes, or feedback).",
    inputSchema: zodToJsonSchema(ManageSolutionRelationshipsArgsSchema),
};

export const manageSolutionRelationships = (context: UserContext) => async ({
    solutionId,
    action,
    opportunityIds,
    outcomeIds,
    feedbackIds
}: z.infer<typeof ManageSolutionRelationshipsArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const relationshipsPayload: SolutionRelationshipsPayload = {
            opportunityIds: opportunityIds || [],
            outcomeIds: outcomeIds || [],
            feedbackIds: feedbackIds || []
        };

        await squadClient().manageSolutionRelationships({
            orgId,
            workspaceId,
            solutionId,
            action: action as RelationshipAction,
            solutionRelationshipsPayload: relationshipsPayload
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    solutionId,
                    action,
                    opportunityIds,
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
