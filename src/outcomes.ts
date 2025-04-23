import { z, ZodError } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";
import {
  CreateOutcomePayload,
  OutcomeRelationshipsPayload,
  RelationshipAction,
  UpdateOutcomePayload,
} from "./lib/openapi/squad/models/index.js";

// Schema definitions
export const CreateOutcomeArgsSchema = z.object({
  title: z.string().describe("A short title for the outcome"),
  description: z.string().describe("A detailed description of the outcome"),
  priority: z
    .number()
    .optional()
    .describe("Priority level of the outcome (numeric)"),
  trend: z
    .number()
    .optional()
    .describe("Trend indicator for the outcome (numeric)"),
  analyticEvents: z
    .array(z.string())
    .optional()
    .describe("List of analytic events associated with the outcome"),
  hideContent: z
    .boolean()
    .optional()
    .describe("Whether the outcome content should be hidden"),
  ownerId: z.string().optional().describe("ID of the outcome owner"),
});

export const createOutcomeTool = {
  name: "create_outcome",
  description:
    "Create a new outcome. An outcome is a business objective or goal that the organization aims to achieve.",
  inputSchema: zodToJsonSchema(CreateOutcomeArgsSchema),
};

export const createOutcome = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = CreateOutcomeArgsSchema.parse(body);

    const { title, description, priority, trend, analyticEvents, ownerId } =
      safeBody;

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

    const res =
      await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOutcomesPost({
        orgId,
        workspaceId,
        createOutcomePayload: outcomeRequest,
      });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(res, null, 2),
        },
      ],
    };
  } catch (e) {
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to create this outcome. Please check that all values are valid. " +
          e.errors.map(e => e.message).join(", ")
        : "I was unable to create this outcome. Please check that the ID is correct.";
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

// Schema for listing outcomes
export const ListOutcomesArgsSchema = z.object({});

export const listOutcomesTool = {
  name: "list_outcomes",
  description:
    "List all outcomes in the workspace. Outcomes are business objectives or goals that the organization aims to achieve.",
  inputSchema: zodToJsonSchema(ListOutcomesArgsSchema),
};

export const listOutcomes = async (
  context: UserContext,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const outcomes =
      await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOutcomesGet({
        orgId,
        workspaceId,
      });

    if (outcomes.data.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No outcomes found.",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              outcomes,
            },
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
    return {
      content: [
        {
          type: "text",
          text: "I was unable to list outcomes. Please check back later.",
        },
      ],
    };
  }
};

// Schema for getting a single outcome
export const GetOutcomeArgsSchema = z.object({
  outcomeId: z.string().describe("The ID of the outcome to retrieve"),
  relationships: z
    .array(z.enum(["opportunities", "solutions", "requirements", "feedback"]))
    .optional()
    .describe(
      "Relationships to include in the response. Opportunities are problem statements identified for the organisation. Solutions are proposed approaches to address opportunities. Requirements are detailed steps to implement a solution. Feedback is additional information or insights related to the opportunity.",
    )
    .default([]),
});

export const getOutcomeTool = {
  name: "get_outcome",
  description:
    "Get details of a specific outcome by ID. Outcomes are business objectives or goals that the organization aims to achieve.",
  inputSchema: zodToJsonSchema(GetOutcomeArgsSchema),
};

export const getOutcome = async (
  context: UserContext,
  args: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;
    const safeArgs = GetOutcomeArgsSchema.parse(args);
    const { outcomeId, relationships } = safeArgs;

    const outcome =
      await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOutcomesOutcomeIdGet(
        {
          orgId,
          workspaceId,
          outcomeId,
          relationships: relationships.join(","),
        },
      );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(outcome, null, 2),
        },
      ],
    };
  } catch (e) {
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to retrieve this outcome. Please check that all values are valid. " +
          e.errors.map(e => e.message).join(", ")
        : "I was unable to retrieve this outcome. Please check that the ID is correct.";
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

// Schema for updating an outcome
export const UpdateOutcomeArgsSchema = z.object({
  outcomeId: z.string().describe("The ID of the outcome to update"),
  title: z.string().optional().describe("Updated title"),
  description: z.string().optional().describe("Updated description"),
  priority: z.number().optional().describe("Updated priority level"),
  trend: z.number().optional().describe("Updated trend indicator"),
  analyticEvents: z
    .array(z.string())
    .optional()
    .describe("Updated list of analytic events"),
  hideContent: z
    .boolean()
    .optional()
    .describe("Whether the outcome content should be hidden"),
  ownerId: z.string().optional().describe("Updated ID of the outcome owner"),
});

export const updateOutcomeTool = {
  name: "update_outcome",
  description: "Update an existing outcome's details.",
  inputSchema: zodToJsonSchema(UpdateOutcomeArgsSchema),
};

export const updateOutcome = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = UpdateOutcomeArgsSchema.parse(body);

    const {
      outcomeId,
      title,
      description,
      priority,
      trend,
      analyticEvents,
      ownerId,
    } = safeBody;

    // First, get the existing outcome to preserve any values we're not updating
    const existingOutcome =
      await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOutcomesOutcomeIdGet(
        {
          orgId,
          workspaceId,
          outcomeId,
        },
      );

    // Create update payload with required fields and defaults
    const updatePayload: UpdateOutcomePayload = {
      title: title || existingOutcome.data.title,
      description: description || existingOutcome.data.description,
      priority:
        priority !== undefined ? priority : existingOutcome.data.priority || 0,
      trend: trend !== undefined ? trend : existingOutcome.data.trend || 0,
      analyticEvents:
        analyticEvents || existingOutcome.data.analyticEvents || [],
    };

    // Only add ownerId if it's defined in the update or existing outcome
    if (ownerId !== undefined || existingOutcome.data.ownerId) {
      updatePayload.ownerId = ownerId || existingOutcome.data.ownerId;
    }

    const outcome =
      await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOutcomesOutcomeIdPut(
        {
          orgId,
          workspaceId,
          outcomeId,
          updateOutcomePayload: updatePayload,
        },
      );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(outcome, null, 2),
        },
      ],
    };
  } catch (e) {
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to update this outcome. Please check that the ID is correct and all values are valid. " +
          e.errors.map(e => e.message).join(", ")
        : "I was unable to update this outcome. Please check that the ID is correct and all values are valid.";
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

// Schema for deleting an outcome
export const DeleteOutcomeArgsSchema = z.object({
  outcomeId: z.string().describe("The ID of the outcome to delete"),
});

export const deleteOutcomeTool = {
  name: "delete_outcome",
  description: "Delete an outcome by ID.",
  inputSchema: zodToJsonSchema(DeleteOutcomeArgsSchema),
};

export const deleteOutcome = async (
  context: UserContext,
  args: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;
    const safeArgs = DeleteOutcomeArgsSchema.parse(args);
    const { outcomeId } = safeArgs;

    const result =
      await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOutcomesOutcomeIdDelete(
        {
          orgId,
          workspaceId,
          outcomeId,
        },
      );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              outcomeId,
            },
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
    return {
      content: [
        {
          type: "text",
          text: "I was unable to delete this outcome. Please check that the ID is correct.",
        },
      ],
    };
  }
};

// Schema for managing outcome relationships
export const ManageOutcomeRelationshipsArgsSchema = z.object({
  outcomeId: z
    .string()
    .describe("The ID of the outcome to manage relationships for"),
  action: z
    .enum(["add", "remove"])
    .describe("Whether to add or remove the relationships"),
  opportunityIds: z
    .array(z.string())
    .optional()
    .describe("IDs of opportunities to relate to this outcome"),
});

export const manageOutcomeRelationshipsTool = {
  name: "manage_outcome_relationships",
  description:
    "Add or remove relationships between an outcome and opportunities for the business.",
  inputSchema: zodToJsonSchema(ManageOutcomeRelationshipsArgsSchema),
};

export const manageOutcomeRelationships = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;
    const safeBody = ManageOutcomeRelationshipsArgsSchema.parse(body);
    const { outcomeId, action, opportunityIds } = safeBody;

    const relationshipsPayload: OutcomeRelationshipsPayload = {
      opportunityIds: opportunityIds || [],
    };

    await squadClient().manageOutcomeRelationships({
      orgId,
      workspaceId,
      outcomeId,
      action: action as RelationshipAction,
      outcomeRelationshipsPayload: relationshipsPayload,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              outcomeId,
              action,
              opportunityIds,
            },
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to manage relationships for this outcome. Please check that all IDs are correct. " +
          e.errors.map(e => e.message).join(", ")
        : "I was unable to manage relationships for this outcome. Please check that all IDs are correct.";
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

export const outcomeTools = [
  createOutcomeTool,
  listOutcomesTool,
  getOutcomeTool,
  updateOutcomeTool,
  deleteOutcomeTool,
  manageOutcomeRelationshipsTool,
];

export const runOutcomeTool = (name: string) => {
  const mapper = {
    create_outcome: createOutcome,
    list_outcomes: listOutcomes,
    get_outcome: getOutcome,
    update_outcome: updateOutcome,
    delete_outcome: deleteOutcome,
    manage_outcome_relationships: manageOutcomeRelationships,
  };

  if (!mapper[name as keyof typeof mapper]) {
    return null;
  }
  return mapper[name as keyof typeof mapper];
};
