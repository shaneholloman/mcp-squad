import { z, ZodError } from "zod";
import { UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";
import {
  CreateRequirement,
  CreateRequirementAiProcessingStateEnum,
  CreateRequirementStatusEnum,
  RelationshipAction,
  RequirementRelationshipsPayload,
  UpdateRequirement,
  UpdateRequirementStatusEnum,
} from "./lib/openapi/squad/models/index.js";

export enum RequirementTool {
  CreateRequirement = "create_requirement",
  ListRequirements = "list_requirements",
  GetRequirement = "get_requirement",
  UpdateRequirement = "update_requirement",
  DeleteRequirement = "delete_requirement",
  ManageRequirementRelationships = "manage_requirement_relationships",
}
// Schema definitions
export const CreateRequirementArgsSchema = z.object({
  title: z.string().describe("A short title for the requirement"),
  description: z.string().describe("A detailed description of the requirement"),
  feature: z.string().describe("The feature this requirement is for"),
  requirements: z.string().describe("The actual requirements text in detail"),
  ownerId: z.string().optional().describe("ID of the requirement owner"),
  status: z
    .enum([
      CreateRequirementStatusEnum.Draft,
      CreateRequirementStatusEnum.Ready,
      CreateRequirementStatusEnum.Complete,
    ])
    .optional()
    .describe(
      `Status of the requirement: Draft is not finalized, Ready is ready to implement, Complete is implemented`,
    ),
});

export const createRequirementTool = {
  name: RequirementTool.CreateRequirement,
  description:
    "Create a new requirement. A requirement defines the specific implementation details needed to fulfill a solution or feature.",
  inputSchema: CreateRequirementArgsSchema,
};

export const createRequirement = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = CreateRequirementArgsSchema.parse(body);

    const { title, description, feature, requirements, ownerId, status } =
      safeBody;

    // Create the requirement object
    const requirementPayload: CreateRequirement = {
      title,
      description,
      feature,
      requirements,
      status: status ?? CreateRequirementStatusEnum.Draft,
      aiProcessingState: CreateRequirementAiProcessingStateEnum.Initial,
      refinementLog: [],
    };

    // Add optional fields if they're defined
    if (ownerId !== undefined) requirementPayload.ownerId = ownerId;
    if (status !== undefined) requirementPayload.status = status;

    const requirement = await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdRequirementsPost({
      orgId,
      workspaceId,
      createRequirement: requirementPayload,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(requirement),
        },
      ],
    };
  } catch (e) {
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to create this requirement. Please check that all values are valid. " +
          e.errors.map(e => e.message).join(", ")
        : "I was unable to create this requirement. Please check that the ID is correct.";
    return {
      content: [
        {
          type: "text",
          text: errorMessage,
        },
      ],
    };
  }
};

// Schema for listing requirements
export const ListRequirementsArgsSchema = z.object({});

export const listRequirementsTool = {
  name: RequirementTool.ListRequirements,
  description:
    "List all requirements in the workspace. Requirements define the specific implementation details needed to fulfill solutions features.",
  inputSchema: ListRequirementsArgsSchema,
};

export const listRequirements = async (
  context: UserContext,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const requirements = await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdRequirementsGet({
      orgId,
      workspaceId,
    });

    if (requirements.data.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No requirements found.",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(requirements),
        },
      ],
    };
  } catch (e) {
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to list requirements. Please check that all values are valid. " +
          e.errors.map(e => e.message).join(", ")
        : "I was unable to list requirements. Please check that the ID is correct.";
    return {
      content: [
        {
          type: "text",
          text: errorMessage,
        },
      ],
    };
  }
};

// Schema for getting a single requirement
export const GetRequirementArgsSchema = z.object({
  requirementId: z.string().describe("The ID of the requirement to retrieve"),
  relationships: z
    .array(z.enum(["opportunities", "solutions", "outcomes", "feedback"]))
    .optional()
    .describe(
      "Relationships to include in the response. Opportunities are problem statements identified for the organisation. Solutions are proposed approaches to address opportunities. Outcomes are business objectives/goals. Feedback is additional information or insights.",
    )
    .default([]),
});

export const getRequirementTool = {
  name: RequirementTool.GetRequirement,
  description:
    "Get details of a specific requirement by ID. Requirements define the specific implementation details needed to fulfill solutions or features.",
  inputSchema: GetRequirementArgsSchema,
};

export const getRequirement = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;
    const safeBody = GetRequirementArgsSchema.parse(body);
    const { requirementId, relationships } = safeBody;

    const requirement = await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdRequirementsRequirementIdGet({
      orgId,
      workspaceId,
      requirementId,
      relationships: relationships.join(","),
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(requirement),
        },
      ],
    };
  } catch (e) {
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to get this requirement. Please check that all values are valid. " +
          e.errors.map(e => e.message).join(", ")
        : "I was unable to get this requirement. Please check that the ID is correct.";
    return {
      content: [
        {
          type: "text",
          text: errorMessage,
        },
      ],
    };
  }
};

// Schema for updating a requirement
export const updateRequirementArgsSchema = z.object({
  requirementId: z.string().describe("The ID of the requirement to update"),
  title: z.string().optional().describe("Updated title"),
  description: z.string().optional().describe("Updated description"),
  feature: z
    .string()
    .optional()
    .describe("Updated feature this requirement is for"),
  requirements: z.string().optional().describe("Updated requirements text"),
  hideContent: z
    .boolean()
    .optional()
    .describe("Whether the requirement content should be hidden"),
  ownerId: z
    .string()
    .optional()
    .describe("Updated ID of the requirement owner"),
  status: z
    .enum([
      UpdateRequirementStatusEnum.Draft,
      UpdateRequirementStatusEnum.Ready,
      UpdateRequirementStatusEnum.Complete,
    ])
    .optional()
    .describe(
      `Status of the requirement: Draft is not finalized, Ready is ready to implement, Complete is implemented`,
    ),
});

type UpdateRequirementArgs = z.infer<typeof updateRequirementArgsSchema>;

export const updateRequirementTool = {
  name: RequirementTool.UpdateRequirement,
  description: "Update an existing requirement's details.",
  inputSchema: updateRequirementArgsSchema,
};

export const updateRequirement = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = updateRequirementArgsSchema.parse(body);

    const {
      requirementId,
      title,
      description,
      feature,
      requirements,
      ownerId,
      status,
    } = safeBody;

    // First, get the existing requirement to preserve any values we're not updating
    const existingRequirement = await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdRequirementsRequirementIdGet({
      orgId,
      workspaceId,
      requirementId: requirementId,
    });

    // Create the update payload with existing values or new ones
    const updatePayload: UpdateRequirement = {
      title: title !== undefined ? title : existingRequirement.data.title,
      description:
        description !== undefined
          ? description
          : existingRequirement.data.description,
      feature:
        feature !== undefined ? feature : existingRequirement.data.feature,
      requirements:
        requirements !== undefined
          ? requirements
          : existingRequirement.data.requirements,
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

    const requirement = await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdRequirementsRequirementIdPut({
      orgId,
      workspaceId,
      requirementId,
      updateRequirement: updatePayload,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(requirement),
        },
      ],
    };
  } catch (e) {
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to update this requirement. Please check that all values are valid. " +
          e.errors.map(e => e.message).join(", ")
        : "I was unable to update this requirement. Please check that the ID is correct.";
    return {
      content: [
        {
          type: "text",
          text: errorMessage,
        },
      ],
    };
  }
};

// Schema for deleting a requirement
export const DeleteRequirementArgsSchema = z.object({
  requirementId: z.string().describe("The ID of the requirement to delete"),
});

export const deleteRequirementTool = {
  name: RequirementTool.DeleteRequirement,
  description: "Delete a requirement by ID.",
  inputSchema: DeleteRequirementArgsSchema,
};

export const deleteRequirement = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;
    const { requirementId } = DeleteRequirementArgsSchema.parse(body);

    await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdRequirementsRequirementIdDelete({
      orgId,
      workspaceId,
      requirementId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            data: {
              id: requirementId,
            },
          }),
        },
      ],
    };
  } catch (e) {
    return {
      content: [
        {
          type: "text",
          text: "I was unable to delete the requirement. Please check that the ID is correct.",
        },
      ],
    };
  }
};

// Schema for managing requirement relationships
export const ManageRequirementRelationshipsArgsSchema = z.object({
  requirementId: z
    .string()
    .describe("The ID of the requirement to manage relationships for"),
  action: z
    .enum(["add", "remove"])
    .describe("Whether to add or remove the relationships"),
  solutionIds: z
    .array(z.string())
    .optional()
    .describe("IDs of solutions to relate to this requirement"),
});

export const manageRequirementRelationshipsTool = {
  name: RequirementTool.ManageRequirementRelationships,
  description:
    "Add or remove relationships between a requirement and other entities (opportunities, solutions, outcomes, or feedback).",
  inputSchema: ManageRequirementRelationshipsArgsSchema,
};

export const manageRequirementRelationships = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;
    const { requirementId, action, solutionIds } =
      ManageRequirementRelationshipsArgsSchema.parse(body);

    const relationshipsPayload: RequirementRelationshipsPayload = {
      solutionIds: solutionIds || [],
    };

    await squadClient({ jwt: context.jwt }).manageRequirementRelationships({
      orgId,
      workspaceId,
      requirementId,
      action: action as RelationshipAction,
      requirementRelationshipsPayload: relationshipsPayload,
    });

    const updatedRequirement = await squadClient({ jwt: context.jwt }).organisationsOrgIdWorkspacesWorkspaceIdRequirementsRequirementIdGet({
      orgId,
      workspaceId,
      requirementId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              updatedRequirement,
            },
          ),
        },
      ],
    };
  } catch (e) {
    return {
      content: [
        {
          type: "text",
          text: "I was unable to manage the requirement relationships. Please check that the IDs are correct.",
        },
      ],
    };
  }
};

export const requirementTools = [
  createRequirementTool,
  listRequirementsTool,
  getRequirementTool,
  updateRequirementTool,
  deleteRequirementTool,
  manageRequirementRelationshipsTool,
];

export const runRequirementTool = (name: string) => {
  const mapper = {
    [RequirementTool.CreateRequirement]: createRequirement,
    [RequirementTool.ListRequirements]: listRequirements,
    [RequirementTool.GetRequirement]: getRequirement,
    [RequirementTool.UpdateRequirement]: updateRequirement,
    [RequirementTool.DeleteRequirement]: deleteRequirement,
    [RequirementTool.ManageRequirementRelationships]:
      manageRequirementRelationships,
  };

  if (!mapper[name as keyof typeof mapper]) {
    return null;
  }
  return mapper[name as keyof typeof mapper];
};

export const vercelTool = (context: UserContext) => ({
  [RequirementTool.CreateRequirement]: {
    description: createRequirementTool.description,
    parameters: createRequirementTool.inputSchema,
    execute: async (args: z.infer<typeof CreateRequirementArgsSchema>) =>
      await createRequirement(context, args),
  },
  [RequirementTool.ListRequirements]: {
    description: listRequirementsTool.description,
    parameters: listRequirementsTool.inputSchema,
    execute: async () => await listRequirements(context),
  },
  [RequirementTool.GetRequirement]: {
    description: getRequirementTool.description,
    parameters: getRequirementTool.inputSchema,
    execute: async (args: z.infer<typeof GetRequirementArgsSchema>) =>
      await getRequirement(context, args),
  },
  [RequirementTool.UpdateRequirement]: {
    description: updateRequirementTool.description,
    parameters: updateRequirementTool.inputSchema,
    execute: async (args: z.infer<typeof updateRequirementArgsSchema>) =>
      await updateRequirement(context, args),
  },
  [RequirementTool.DeleteRequirement]: {
    description: deleteRequirementTool.description,
    parameters: deleteRequirementTool.inputSchema,
    execute: async (args: z.infer<typeof DeleteRequirementArgsSchema>) =>
      await deleteRequirement(context, args),
  },
  [RequirementTool.ManageRequirementRelationships]: {
    description: manageRequirementRelationshipsTool.description,
    parameters: manageRequirementRelationshipsTool.inputSchema,
    execute: async (
      args: z.infer<typeof ManageRequirementRelationshipsArgsSchema>,
    ) => await manageRequirementRelationships(context, args),
  },
});
