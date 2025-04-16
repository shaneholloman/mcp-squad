import { z } from "zod";
import { squadClient } from "./lib/clients/squad.js";
import { UserContext } from "./helpers/getUser.js";
import { 
    CreateRequirement,
    CreateRequirementAiProcessingStateEnum,
    CreateRequirementStatusEnum,
    RelationshipAction, 
    RequirementRelationshipsPayload,
    UpdateRequirement,
    UpdateRequirementStatusEnum
} from "./lib/openapi/squad/models/index.js";
import { zodToJsonSchema } from "zod-to-json-schema";

// Schema definitions
export const CreateRequirementArgsSchema = z.object({
    title: z.string().describe("A short title for the requirement"),
    description: z.string().describe("A detailed description of the requirement"),
    feature: z.string().describe("The feature this requirement is for"),
    requirements: z.string().describe("The actual requirements text in detail"),
    ownerId: z.string().optional().describe("ID of the requirement owner"),
    status: z.enum([
        CreateRequirementStatusEnum.Draft,
        CreateRequirementStatusEnum.Ready,
        CreateRequirementStatusEnum.Complete
    ]).optional().describe(`Status of the requirement: Draft is not finalized, Ready is ready to implement, Complete is implemented`),
});

export const createRequirementTool = {
    name: "create_requirement",
    description: "Create a new requirement. A requirement defines the specific implementation details needed to fulfill a solution or feature.",
    inputSchema: zodToJsonSchema(CreateRequirementArgsSchema),
};

export const createRequirement = (context: UserContext) => async ({
    title,
    description,
    feature,
    requirements,
    ownerId,
    status,
}: z.infer<typeof CreateRequirementArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        // Create the requirement object
        const requirementPayload: CreateRequirement = {
            title,
            description,
            feature,
            requirements,
            status: status ?? CreateRequirementStatusEnum.Draft,
            aiProcessingState: CreateRequirementAiProcessingStateEnum.Initial,
            refinementLog: []
        };
        
        // Add optional fields if they're defined
        if (ownerId !== undefined) requirementPayload.ownerId = ownerId;
        if (status !== undefined) requirementPayload.status = status;

        const requirement = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdRequirementsPost({
            orgId,
            workspaceId,
            createRequirement: requirementPayload
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify(requirement, null, 2),
            }],
        }
    } catch (e) {
        console.error("error", e)
        throw e;
    }
};

// Schema for listing requirements
export const ListRequirementsArgsSchema = z.object({});

export const listRequirementsTool = {
    name: "list_requirements",
    description: "List all requirements in the workspace. Requirements define the specific implementation details needed to fulfill solutions features.",
    inputSchema: zodToJsonSchema(ListRequirementsArgsSchema),
};

export const listRequirements = (context: UserContext) => async (
    _args: z.infer<typeof ListRequirementsArgsSchema>
): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const requirements = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdRequirementsGet({
            orgId,
            workspaceId,
        });

        if (requirements.data.length === 0) {
            return {
                content: [{
                    type: "text",
                    text: "No requirements found."
                }]
            };
        }

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    requirements,
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for getting a single requirement
export const GetRequirementArgsSchema = z.object({
    requirementId: z.string().describe("The ID of the requirement to retrieve"),
    relationships: z.array(z.enum(["opportunities", "solutions", "outcomes", "feedback"]))
        .optional()
        .describe("Relationships to include in the response. Opportunities are problem statements identified for the organisation. Solutions are proposed approaches to address opportunities. Outcomes are business objectives/goals. Feedback is additional information or insights.")
        .default([]),
});

export const getRequirementTool = {
    name: "get_requirement",
    description: "Get details of a specific requirement by ID. Requirements define the specific implementation details needed to fulfill solutions or features.",
    inputSchema: zodToJsonSchema(GetRequirementArgsSchema),
};

export const getRequirement = (context: UserContext) => async ({
    requirementId,
    relationships
}: z.infer<typeof GetRequirementArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const requirement = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdRequirementsRequirementIdGet({
            orgId,
            workspaceId,
            requirementId,
            relationships: relationships.join(",")
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify(requirement, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for updating a requirement
export const updateRequirementArgsSchema = z.object({
    requirementId: z.string().describe("The ID of the requirement to update"),
    title: z.string().optional().describe("Updated title"),
    description: z.string().optional().describe("Updated description"),
    feature: z.string().optional().describe("Updated feature this requirement is for"),
    requirements: z.string().optional().describe("Updated requirements text"),
    hideContent: z.boolean().optional().describe("Whether the requirement content should be hidden"),
    ownerId: z.string().optional().describe("Updated ID of the requirement owner"),
    status: z.enum([ UpdateRequirementStatusEnum.Draft, UpdateRequirementStatusEnum.Ready, UpdateRequirementStatusEnum.Complete]).optional().describe(`Status of the requirement: Draft is not finalized, Ready is ready to implement, Complete is implemented`),
});

type UpdateRequirementArgs = z.infer<typeof updateRequirementArgsSchema>;

export const updateRequirementTool = {
    name: "update_requirement",
    description: "Update an existing requirement's details.",
    inputSchema: zodToJsonSchema(updateRequirementArgsSchema),
};

export const updateRequirement = (context: UserContext) => async ({
    requirementId,
    title,
    description,
    feature,
    requirements,
    ownerId,
    status
}: UpdateRequirementArgs): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        // First, get the existing requirement to preserve any values we're not updating
        const existingRequirement = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdRequirementsRequirementIdGet({
            orgId,
            workspaceId,
            requirementId: requirementId
        });

        // Create the update payload with existing values or new ones
        const updatePayload: UpdateRequirement = {
            title: title !== undefined ? title : existingRequirement.data.title,
            description: description !== undefined ? description : existingRequirement.data.description,
            feature: feature !== undefined ? feature : existingRequirement.data.feature,
            requirements: requirements !== undefined ? requirements : existingRequirement.data.requirements
        };

        if (ownerId !== undefined) {
            updatePayload.ownerId = ownerId;
        } else if (existingRequirement.data.ownerId !== undefined) {
            updatePayload.ownerId = existingRequirement.data.ownerId;
        }

        if (status !== undefined) {
            updatePayload.status = status;
        } else if (existingRequirement.data.status !== undefined) {
            updatePayload.status = existingRequirement.data.status as any;
        }

        const requirement = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdRequirementsRequirementIdPut({
            orgId,
            workspaceId,
            requirementId,
            updateRequirement: updatePayload
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify(requirement, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for deleting a requirement
export const DeleteRequirementArgsSchema = z.object({
    requirementId: z.string().describe("The ID of the requirement to delete"),
});

export const deleteRequirementTool = {
    name: "delete_requirement",
    description: "Delete a requirement by ID.",
    inputSchema: zodToJsonSchema(DeleteRequirementArgsSchema),
};

export const deleteRequirement = (context: UserContext) => async ({
    requirementId
}: z.infer<typeof DeleteRequirementArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const result = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdRequirementsRequirementIdDelete({
            orgId,
            workspaceId,
            requirementId
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    requirementId
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};

// Schema for managing requirement relationships
export const ManageRequirementRelationshipsArgsSchema = z.object({
    requirementId: z.string().describe("The ID of the requirement to manage relationships for"),
    action: z.enum(["add", "remove"]).describe("Whether to add or remove the relationships"),
    solutionIds: z.array(z.string()).optional().describe("IDs of solutions to relate to this requirement"),
});

export const manageRequirementRelationshipsTool = {
    name: "manage_requirement_relationships",
    description: "Add or remove relationships between a requirement and other entities (opportunities, solutions, outcomes, or feedback).",
    inputSchema: zodToJsonSchema(ManageRequirementRelationshipsArgsSchema),
};

export const manageRequirementRelationships = (context: UserContext) => async ({
    requirementId,
    action,
    solutionIds
}: z.infer<typeof ManageRequirementRelationshipsArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const relationshipsPayload: RequirementRelationshipsPayload = {
            solutionIds: solutionIds || [],
        };

        await squadClient().manageRequirementRelationships({
            orgId,
            workspaceId,
            requirementId,
            action: action as RelationshipAction,
            requirementRelationshipsPayload: relationshipsPayload
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    requirementId,
                    action,
                    solutionIds
                }, null, 2)
            }]
        };
    } catch (e) {
        console.error("error", e);
        throw e;
    }
};
