import { z } from "zod";
import { chatToolHelperSchema, UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";
import { InsightSourceEnum } from "./lib/openapi/squad/models/InsightSourceEnum.js";
import { CreateInsightRequestTypeEnum } from "./lib/openapi/squad/models/CreateInsightRequest.js";

export enum InsightTool {
  CreateInsight = "create_insight",
  ListInsights = "list_insights",
  GetInsight = "get_insight",
  DeleteInsight = "delete_insight",
}

// Schema definitions
export const CreateInsightArgsSchema = z.object({
  type: z
    .enum([
      CreateInsightRequestTypeEnum.Feedback,
      CreateInsightRequestTypeEnum.Bug,
      CreateInsightRequestTypeEnum.FeatureRequest,
    ])
    .describe(
      "The type of insight: 'Feedback' for customer feedback, 'Bug' for bug reports, or 'FeatureRequest' for feature requests.",
    ),
  title: z.string().describe("A brief title summarizing the insight"),
  description: z.string().describe("A short description of the insight"),
});

export const createInsightTool = {
  name: InsightTool.CreateInsight,
  description:
    "Create a new insight entry. An insight is customer-generated feedback about your product, often from reviews, surveys, or questionnaires.",
  inputSchema: CreateInsightArgsSchema,
};

export const createInsight = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = CreateInsightArgsSchema.parse(body);

    const res = await squadClient(
      context.jwt,
    ).createInsight({
      orgId,
      workspaceId,
      createInsightRequest: {
        type: safeBody.type,
        title: safeBody.title,
        description: safeBody.description,
        organisationId: orgId,
        workspaceId: workspaceId,
      },
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(res),
        },
      ],
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

// Schema for listing insights
export const ListInsightsArgsSchema = z.object({});

export const listInsightsTool = {
  name: InsightTool.ListInsights,
  description:
    "List all insights for the workspace. These insights are gathered from various sources, created by customers, and help understand how to improve the business.",
  inputSchema: ListInsightsArgsSchema,
};

export const listInsights = async (
  context: UserContext,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const insights = await squadClient(
      context.jwt,
    ).listInsights({
      orgId,
      workspaceId,
    });

    if (insights.data.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No insight entries found.",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(insights),
        },
      ],
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

// Schema for getting a single insight entry
export const GetInsightArgsSchema = z.object({
  insightId: z.string().describe("The ID of the insight entry to retrieve"),
  relationships: z
    .enum(["opportunities", "solutions", "outcomes"])
    .optional()
    .describe("Show other entities that this insight is related to."),
});

export const getInsightTool = {
  name: InsightTool.GetInsight,
  description:
    "Get details of a specific insight entry by ID. Insight entries are text documents that can be used as references or information sources.",
  inputSchema: GetInsightArgsSchema,
};

export const getInsight = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = GetInsightArgsSchema.parse(body);

    const insight = await squadClient(
      context.jwt,
    ).getInsight({
      orgId,
      workspaceId,
      insightId: safeBody.insightId,
      relationships: safeBody.relationships,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(insight),
        },
      ],
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

// Schema for deleting an insight entry
export const DeleteInsightArgsSchema = z.object({
  insightId: z.string().describe("The ID of the insight entry to delete"),
});

export const deleteInsightTool = {
  name: InsightTool.DeleteInsight,
  description: "Delete an insight entry by ID.",
  inputSchema: DeleteInsightArgsSchema,
};

export const deleteInsight = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = DeleteInsightArgsSchema.parse(body);

    const insightId = safeBody.insightId;

    const result = await squadClient(
      context.jwt,
    ).deleteInsight({
      orgId,
      workspaceId,
      insightId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

export const insightTools = [
  createInsightTool,
  listInsightsTool,
  getInsightTool,
  deleteInsightTool,
];

export const runInsightTool = (name: string) => {
  const mapper = {
    [InsightTool.CreateInsight]: createInsight,
    [InsightTool.ListInsights]: listInsights,
    [InsightTool.GetInsight]: getInsight,
    [InsightTool.DeleteInsight]: deleteInsight,
  };

  if (!mapper[name as keyof typeof mapper]) {
    return null;
  }

  return mapper[name as keyof typeof mapper];
};

const createInsightChatTool = CreateInsightArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Creating insight...",
    defaultCompletedText: "Insight created.",
  }),
);

const listInsightsChatTool = ListInsightsArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Listing insights...",
    defaultCompletedText: "Insights listed.",
  }),
);

const getInsightChatTool = GetInsightArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Getting insight...",
    defaultCompletedText: "Insight retrieved.",
  }),
);

const deleteInsightChatTool = DeleteInsightArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Deleting insight...",
    defaultCompletedText: "Insight deleted.",
  }),
);

export const vercelTool = (context: UserContext) => ({
  [InsightTool.CreateInsight]: {
    description: createInsightTool.description,
    parameters: createInsightChatTool,
    execute: async (args: z.infer<typeof createInsightChatTool>) =>
      await createInsight(context, args),
  },
  [InsightTool.ListInsights]: {
    description: listInsightsTool.description,
    parameters: listInsightsChatTool,
    execute: async (args: z.infer<typeof listInsightsChatTool>) =>
      await listInsights(context),
  },
  [InsightTool.GetInsight]: {
    description: getInsightTool.description,
    parameters: getInsightChatTool,
    execute: async (args: z.infer<typeof getInsightChatTool>) =>
      await getInsight(context, args),
  },
  [InsightTool.DeleteInsight]: {
    description: deleteInsightTool.description,
    parameters: deleteInsightChatTool,
    execute: async (args: z.infer<typeof deleteInsightChatTool>) =>
      await deleteInsight(context, args),
  },
});
