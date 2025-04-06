import { z } from "zod";
import { squadClient } from "./lib/clients/squad.js";
import { UserContext } from "./helpers/getUser.js";
import { 
    RelationshipAction, 
    OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequest,
    OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum,
    RequirementRelationshipsPayload
} from "./lib/openapi/squad/models/index.js";
import { zodToJsonSchema } from "zod-to-json-schema";

// Schema definitions
export const CreateRequirementArgsSchema = z.object({
    title: z.string().describe("A short title for the requirement"),
    description: z.string().describe("A detailed description of the requirement"),
    feature: z.string().describe("The feature this requirement is for"),
    requirements: z.string().describe("The actual requirements text in detail"),
    hideContent: z.boolean().optional().describe("Whether the requirement content should be hidden"),
    ownerId: z.string().optional().describe("ID of the requirement owner"),
    status: z.enum([
        OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum.Draft,
        OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum.Ready,
        OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum.Complete
    ]).optional().describe(`Status of the requirement: ${OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum.Draft} is not finalized, ${OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum.Ready} is ready to implement, ${OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum.Complete} is implemented`),
    generatedBy: z.string().optional().describe("Identifier of what generated this requirement (if auto-generated)"),
    generatedFrom: z.string().optional().describe("Source from which this requirement was generated (if auto-generated)"),
    modelName: z.string().optional().describe("The AI model name used to generate this requirement (if auto-generated)"),
    modelProvider: z.string().optional().describe("The AI model provider used to generate this requirement (if auto-generated)")
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
    hideContent,
    ownerId,
    status,
    generatedBy,
    generatedFrom,
    modelName,
    modelProvider
}: z.infer<typeof CreateRequirementArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        // Create the requirement object
        const requirementPayload: OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequest = {
            title,
            description,
            feature,
            requirements,
            hideContent: hideContent || false
        };
        
        // Add optional fields if they're defined
        if (ownerId !== undefined) requirementPayload.ownerId = ownerId;
        if (status !== undefined) requirementPayload.status = status;
        if (generatedBy !== undefined) requirementPayload.generatedBy = generatedBy;
        if (generatedFrom !== undefined) requirementPayload.generatedFrom = generatedFrom;
        if (modelName !== undefined) requirementPayload.modelName = modelName;
        if (modelProvider !== undefined) requirementPayload.modelProvider = modelProvider;

        const requirement = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdRequirementsPost({
            orgId,
            workspaceId,
            organisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequest: requirementPayload
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
export const UpdateRequirementArgsSchema = z.object({
    requirementId: z.string().describe("The ID of the requirement to update"),
    title: z.string().optional().describe("Updated title"),
    description: z.string().optional().describe("Updated description"),
    feature: z.string().optional().describe("Updated feature this requirement is for"),
    requirements: z.string().optional().describe("Updated requirements text"),
    hideContent: z.boolean().optional().describe("Whether the requirement content should be hidden"),
    ownerId: z.string().optional().describe("Updated ID of the requirement owner"),
    status: z.enum([
        OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum.Draft,
        OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum.Ready,
        OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum.Complete
    ]).optional().describe(`Status of the requirement: ${OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum.Draft} is not finalized, ${OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum.Ready} is ready to implement, ${OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequestStatusEnum.Complete} is implemented`),
});

export const updateRequirementTool = {
    name: "update_requirement",
    description: "Update an existing requirement's details.",
    inputSchema: zodToJsonSchema(UpdateRequirementArgsSchema),
};

export const updateRequirement = (context: UserContext) => async ({
    requirementId,
    title,
    description,
    feature,
    requirements,
    hideContent,
    ownerId,
    status
}: z.infer<typeof UpdateRequirementArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        // First, get the existing requirement to preserve any values we're not updating
        const existingRequirement = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdRequirementsRequirementIdGet({
            orgId,
            workspaceId,
            requirementId
        });

        // Create the update payload with existing values or new ones
        const updatePayload: OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsPostRequest = {
            title: title !== undefined ? title : existingRequirement.data.title,
            description: description !== undefined ? description : existingRequirement.data.description,
            feature: feature !== undefined ? feature : existingRequirement.data.feature,
            requirements: requirements !== undefined ? requirements : existingRequirement.data.requirements
        };

        // Add optional fields if they're provided or existed before
        if (hideContent !== undefined) {
            updatePayload.hideContent = hideContent;
        } else if (existingRequirement.data.hideContent !== undefined) {
            updatePayload.hideContent = existingRequirement.data.hideContent;
        }

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

        // Preserve other potential attributes from the original requirement
        // These might not be available in the typing of the response
        // but we'll handle them safely if they exist in the API
        const existingReqObj = existingRequirement as any;

        if (existingReqObj.generatedBy) {
            updatePayload.generatedBy = existingReqObj.generatedBy;
        }
        
        if (existingReqObj.generatedFrom) {
            updatePayload.generatedFrom = existingReqObj.generatedFrom;
        }
        
        if (existingReqObj.modelName) {
            updatePayload.modelName = existingReqObj.modelName;
        }
        
        if (existingReqObj.modelProvider) {
            updatePayload.modelProvider = existingReqObj.modelProvider;
        }

        const requirement = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdRequirementsRequirementIdPut({
            orgId,
            workspaceId,
            requirementId,
            organisationsOrgIdWorkspacesWorkspaceIdRequirementsRequirementIdPutRequest: updatePayload
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
    opportunityIds: z.array(z.string()).optional().describe("IDs of opportunities to relate to this requirement"),
    solutionIds: z.array(z.string()).optional().describe("IDs of solutions to relate to this requirement"),
    outcomeIds: z.array(z.string()).optional().describe("IDs of outcomes to relate to this requirement"),
    feedbackIds: z.array(z.string()).optional().describe("IDs of feedback items to relate to this requirement"),
});

export const manageRequirementRelationshipsTool = {
    name: "manage_requirement_relationships",
    description: "Add or remove relationships between a requirement and other entities (opportunities, solutions, outcomes, or feedback).",
    inputSchema: zodToJsonSchema(ManageRequirementRelationshipsArgsSchema),
};

export const manageRequirementRelationships = (context: UserContext) => async ({
    requirementId,
    action,
    opportunityIds,
    solutionIds,
    outcomeIds,
    feedbackIds
}: z.infer<typeof ManageRequirementRelationshipsArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
    try {
        const { orgId, workspaceId } = context;

        const relationshipsPayload: RequirementRelationshipsPayload = {
            opportunityIds: opportunityIds || [],
            solutionIds: solutionIds || [],
            outcomeIds: outcomeIds || [],
            feedbackIds: feedbackIds || []
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
                    opportunityIds,
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
