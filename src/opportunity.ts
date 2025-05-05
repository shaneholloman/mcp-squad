import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";
import {
  OpportunityRelationshipsPayload,
  RelationshipAction,
  UpdateOpportunityPayload,
  UpdateOpportunityPayloadStatusEnum,
} from "./lib/openapi/squad/models/index.js";

// Schema definitions
export const CreateOpportunityArgsSchema = z.object({
  title: z.string().describe("A short title"),
  description: z
    .string()
    .describe(
      "A short description of the opportunity, detailing the problem statement and opportunity for the business",
    ),
});

export const createOpportunityTool = {
  name: "create_opportunity",
  description:
    "Create a new opportunity. An opportunity is a detailed problem statement identified for the organisation. It doesn't have any solutionising and simply captures an opportunity for the organisation.",
  inputSchema: zodToJsonSchema(CreateOpportunityArgsSchema),
};

export const createOpportunity = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = CreateOpportunityArgsSchema.parse(body);

    const { title, description } = safeBody;

    const res =
      await squadClient(context.jwt).organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesPost(
        {
          orgId,
          workspaceId,
          createOpportunityPayload: {
            title,
            description,
            createdBy: "user",
          },
        },
      );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(res, null, 2),
        },
      ],
    };
  } catch (e) {
    return {
      content: [
        {
          type: "text",
          text: "I was unable to create this opportunity. Please check back later",
        },
      ],
    };
  }
};

// Schema for listing opportunities
export const ListOpportunitiesArgsSchema = z.object({});

export const listOpportunitiesTool = {
  name: "list_opportunities",
  description:
    "List all opportunities in the workspace. Opportunities are problem statements identified for the organisation.",
  inputSchema: zodToJsonSchema(ListOpportunitiesArgsSchema),
};

export const listOpportunities = async (
  context: UserContext,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const opportunities =
      await squadClient(context.jwt).organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesGet(
        {
          orgId,
          workspaceId,
        },
      );

    if (opportunities.data.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No opportunities found.",
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
              opportunities,
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
          text: "I was unable to list opportunities. Please check back later",
        },
      ],
    };
  }
};

// Schema for getting a single opportunity
export const GetOpportunityArgsSchema = z.object({
  opportunityId: z.string().describe("The ID of the opportunity to retrieve"),
  relationships: z
    .array(z.enum(["solutions", "requirements", "outcomes", "feedback"]))
    .optional()
    .describe(
      "Relationships to include in the response. Outcomes are business objectives/goals. Solutions are proposed approaches to address opportunities. Requirements are detailed steps to implement a solution. Feedback is additional information or insights related to the opportunity.",
    )
    .default([]),
});

export const getOpportunityTool = {
  name: "get_opportunity",
  description:
    "Get details of a specific opportunity by ID. Opportunities are problem statements identified for the organisation.",
  inputSchema: zodToJsonSchema(GetOpportunityArgsSchema),
};

export const getOpportunity = async (
  context: UserContext,
  args: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;

    const safeArgs = GetOpportunityArgsSchema.parse(args);

    const { opportunityId, relationships } = safeArgs;

    const opportunity =
      await squadClient(context.jwt).organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesOpportunityIdGet(
        {
          orgId,
          workspaceId,
          opportunityId,
          relationships: relationships.join(","),
        },
      );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(opportunity, null, 2),
        },
      ],
    };
  } catch (e) {
    return {
      content: [
        {
          type: "text",
          text: "I was unable to get this opportunity. Please check back later",
        },
      ],
    };
  }
};

// Schema for updating an opportunity
export const UpdateOpportunityArgsSchema = z.object({
  opportunityId: z.string().describe("The ID of the opportunity to update"),
  title: z.string().optional().describe("Updated title"),
  description: z.string().optional().describe("Updated description"),
  status: z
    .enum([
      UpdateOpportunityPayloadStatusEnum.New,
      UpdateOpportunityPayloadStatusEnum.Solved,
      UpdateOpportunityPayloadStatusEnum.Planned,
      UpdateOpportunityPayloadStatusEnum.InProgress,
    ])
    .optional()
    .describe(
      `Updated status: ${UpdateOpportunityPayloadStatusEnum.New} hasn't been developed, ${UpdateOpportunityPayloadStatusEnum.InProgress} means we're currently building out solutions and implementing them. ${UpdateOpportunityPayloadStatusEnum.Planned} means we've finished developing the solutions and are ready to implement them. ${UpdateOpportunityPayloadStatusEnum.Solved} means we've completed the implementation and the opportunity is considered addressed.`,
    ),
});

export const updateOpportunityTool = {
  name: "update_opportunity",
  description:
    "Update an existing opportunity's details such as title, description, or status.",
  inputSchema: zodToJsonSchema(UpdateOpportunityArgsSchema),
};

export const updateOpportunity = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = UpdateOpportunityArgsSchema.parse(body);

    const { opportunityId, title, description, status } = safeBody;

    const updatePayload: UpdateOpportunityPayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description;
    if (status !== undefined) updatePayload.status = status;

    const opportunity =
      await squadClient(context.jwt).organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesOpportunityIdPut(
        {
          orgId,
          workspaceId,
          opportunityId,
          updateOpportunityPayload: updatePayload,
        },
      );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(opportunity, null, 2),
        },
      ],
    };
  } catch (e) {
    return {
      content: [
        {
          type: "text",
          text: "I was unable to update this opportunity. Please check back later",
        },
      ],
    };
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

export const deleteOpportunity = async (
  context: UserContext,
  args: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;

    const safeArgs = DeleteOpportunityArgsSchema.parse(args);

    const { opportunityId } = safeArgs;

    const result =
      await squadClient(context.jwt).organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesOpportunityIdDelete(
        {
          orgId,
          workspaceId,
          opportunityId,
        },
      );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              opportunityId,
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
          text: "I was unable to delete this opportunity. Please check back later",
        },
      ],
    };
  }
};

// Schema for generating solutions for an opportunity
export const GenerateSolutionsArgsSchema = z.object({
  opportunityId: z
    .string()
    .describe("The ID of the opportunity to generate solutions for"),
  prompt: z
    .string()
    .optional()
    .describe("Optional prompt to guide solution generation"),
});

export const generateSolutionsTool = {
  name: "generate_solutions",
  description:
    "Start the process of generating solutions for an opportunity. This will use Squad AI to generate new potential solutions for a given opportunity.",
  inputSchema: zodToJsonSchema(GenerateSolutionsArgsSchema),
};

export const generateSolutions = async (
  context: UserContext,
  args: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;

    const safeArgs = GenerateSolutionsArgsSchema.parse(args);

    const { opportunityId, prompt } = safeArgs;

    await squadClient(context.jwt).organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesOpportunityIdGenerateSolutionsPost(
      {
        orgId,
        workspaceId,
        opportunityId,
      },
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              opportunityId,
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
          text: "I was unable to generate solutions for this opportunity. Please check back later",
        },
      ],
    };
  }
};

// Schema for managing opportunity relationships
export const ManageOpportunityRelationshipsArgsSchema = z.object({
  opportunityId: z
    .string()
    .describe("The ID of the opportunity to manage relationships for"),
  action: z
    .enum(["add", "remove"])
    .describe("Whether to add or remove the relationships"),
  solutionIds: z
    .array(z.string())
    .optional()
    .describe("IDs of solutions to relate to this opportunity"),
  outcomeIds: z
    .array(z.string())
    .optional()
    .describe("IDs of outcomes to relate to this opportunity"),
  feedbackIds: z
    .array(z.string())
    .optional()
    .describe("IDs of feedback items to relate to this opportunity"),
});

export const manageOpportunityRelationshipsTool = {
  name: "manage_opportunity_relationships",
  description:
    "Add or remove relationships between an opportunity and other entities (solutions, outcomes, or feedback).",
  inputSchema: zodToJsonSchema(ManageOpportunityRelationshipsArgsSchema),
};

export const manageOpportunityRelationships = async (
  context: UserContext,
  args: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;

    const safeArgs = ManageOpportunityRelationshipsArgsSchema.parse(args);

    const { opportunityId, action, solutionIds, outcomeIds, feedbackIds } =
      safeArgs;

    const relationshipsPayload: OpportunityRelationshipsPayload = {
      solutionIds: solutionIds || [],
      outcomeIds: outcomeIds || [],
      feedbackIds: feedbackIds || [],
    };

    await squadClient(context.jwt).manageOpportunityRelationships({
      orgId,
      workspaceId,
      opportunityId,
      action: action as RelationshipAction,
      opportunityRelationshipsPayload: relationshipsPayload,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              opportunityId,
              action,
              solutionIds,
              outcomeIds,
              feedbackIds,
            },
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

export const opportunityTools = [
  createOpportunityTool,
  listOpportunitiesTool,
  getOpportunityTool,
  updateOpportunityTool,
  deleteOpportunityTool,
  generateSolutionsTool,
  manageOpportunityRelationshipsTool,
];

export const runOpportunityTool = (name: string) => {
  const mapper = {
    create_opportunity: createOpportunity,
    list_opportunities: listOpportunities,
    get_opportunity: getOpportunity,
    update_opportunity: updateOpportunity,
    delete_opportunity: deleteOpportunity,
    generate_solutions: generateSolutions,
    manage_opportunity_relationships: manageOpportunityRelationships,
  };

  if (!mapper[name as keyof typeof mapper]) {
    return null;
  }
  return mapper[name as keyof typeof mapper];
};

export const vercelTool = (context: UserContext) => ({
  create_opportunity: {
    description: createOpportunityTool.description,
    parameters: createOpportunityTool.inputSchema,
    execute: (args: z.infer<typeof CreateOpportunityArgsSchema>) => createOpportunity(context, args),
  },
  list_opportunities: {
    description: listOpportunitiesTool.description,
    parameters: listOpportunitiesTool.inputSchema,
    execute: () => listOpportunities(context),
  },
  get_opportunity: {
    description: getOpportunityTool.description,
    parameters: getOpportunityTool.inputSchema,
    execute: (args: z.infer<typeof GetOpportunityArgsSchema>) => getOpportunity(context, args),
  },
  update_opportunity: {
    description: updateOpportunityTool.description,
    parameters: updateOpportunityTool.inputSchema,
    execute: (args: z.infer<typeof UpdateOpportunityArgsSchema>) => updateOpportunity(context, args),
  },
  delete_opportunity: {
    description: deleteOpportunityTool.description,
    parameters: deleteOpportunityTool.inputSchema,
    execute: (args: z.infer<typeof DeleteOpportunityArgsSchema>) => deleteOpportunity(context, args),
  },
  generate_solutions: {
    description: generateSolutionsTool.description,
    parameters: generateSolutionsTool.inputSchema,
    execute: (args: z.infer<typeof GenerateSolutionsArgsSchema>) => generateSolutions(context, args),
  },
  manage_opportunity_relationships: {
    description: manageOpportunityRelationshipsTool.description,
    parameters: manageOpportunityRelationshipsTool.inputSchema,
    execute: (args: z.infer<typeof ManageOpportunityRelationshipsArgsSchema>) => manageOpportunityRelationships(context, args),
  },
})