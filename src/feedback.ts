import { z } from "zod";
import { chatToolHelperSchema, UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";
import { CreateFeedbackRequestSentimentCategoryEnum } from "./lib/openapi/squad/models/CreateFeedbackRequest.js";

export enum FeedbackTool {
  CreateFeedback = "create_feedback",
  ListFeedback = "list_feedback",
  GetFeedback = "get_feedback",
  DeleteFeedback = "delete_feedback",
}

// Schema definitions
export const CreateFeedbackArgsSchema = z.object({
  content: z.string().describe("The original raw feedback content from the user"),
  source: z.string().describe("The source of the feedback (e.g., 'Typeform', 'Slack', 'Manual', 'Email', etc.)"),
  sentimentScore: z
    .number()
    .min(-1)
    .max(1)
    .optional()
    .describe("Sentiment score from -1 (negative) to 1 (positive)"),
  sentimentCategory: z
    .enum([
      CreateFeedbackRequestSentimentCategoryEnum.Positive,
      CreateFeedbackRequestSentimentCategoryEnum.Neutral,
      CreateFeedbackRequestSentimentCategoryEnum.Negative,
    ])
    .optional()
    .describe("Sentiment classification category: 'Positive', 'Neutral', or 'Negative'"),
  sentimentConfidence: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe("Confidence in sentiment analysis (0-1)"),
});

export const createFeedbackTool = {
  name: FeedbackTool.CreateFeedback,
  description:
    "Create a new feedback entry. Feedback represents raw, unprocessed feedback from users that can later be analyzed and converted into insights.",
  inputSchema: CreateFeedbackArgsSchema,
};

export const createFeedback = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = CreateFeedbackArgsSchema.parse(body);

    const res = await squadClient(
      context.jwt,
    ).createFeedback({
      orgId,
      workspaceId,
      createFeedbackRequest: {
        content: safeBody.content,
        source: safeBody.source,
        sentimentScore: safeBody.sentimentScore,
        sentimentCategory: safeBody.sentimentCategory,
        sentimentConfidence: safeBody.sentimentConfidence,
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

// Schema for listing feedback
export const ListFeedbackArgsSchema = z.object({});

export const listFeedbackTool = {
  name: FeedbackTool.ListFeedback,
  description:
    "List all feedback entries in the workspace. Feedback entries are raw customer feedback that can be processed into insights.",
  inputSchema: ListFeedbackArgsSchema,
};

export const listFeedback = async (
  context: UserContext,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const feedback = await squadClient(
      context.jwt,
    ).listFeedback({
      orgId,
      workspaceId,
    });

    if (feedback.data.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No feedback entries found.",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(feedback),
        },
      ],
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

// Schema for getting a single feedback entry
export const GetFeedbackArgsSchema = z.object({
  feedbackId: z.string().describe("The ID of the feedback entry to retrieve"),
  relationships: z
    .enum(["insights"])
    .optional()
    .describe("Show insights that were generated from this feedback."),
});

export const getFeedbackTool = {
  name: FeedbackTool.GetFeedback,
  description:
    "Get details of a specific feedback entry by ID. Feedback entries are raw customer feedback.",
  inputSchema: GetFeedbackArgsSchema,
};

export const getFeedback = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = GetFeedbackArgsSchema.parse(body);

    const feedback = await squadClient(
      context.jwt,
    ).getFeedback({
      orgId,
      workspaceId,
      feedbackId: safeBody.feedbackId,
      relationships: safeBody.relationships,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(feedback),
        },
      ],
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

// Schema for deleting a feedback entry
export const DeleteFeedbackArgsSchema = z.object({
  feedbackId: z.string().describe("The ID of the feedback entry to delete"),
});

export const deleteFeedbackTool = {
  name: FeedbackTool.DeleteFeedback,
  description: "Delete a feedback entry by ID.",
  inputSchema: DeleteFeedbackArgsSchema,
};

export const deleteFeedback = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = DeleteFeedbackArgsSchema.parse(body);

    const feedbackId = safeBody.feedbackId;

    const result = await squadClient(
      context.jwt,
    ).deleteFeedback({
      orgId,
      workspaceId,
      feedbackId,
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

export const feedbackTools = [
  createFeedbackTool,
  listFeedbackTool,
  getFeedbackTool,
  deleteFeedbackTool,
];

export const runFeedbackTool = (name: string) => {
  const mapper = {
    [FeedbackTool.CreateFeedback]: createFeedback,
    [FeedbackTool.ListFeedback]: listFeedback,
    [FeedbackTool.GetFeedback]: getFeedback,
    [FeedbackTool.DeleteFeedback]: deleteFeedback,
  };

  if (!mapper[name as keyof typeof mapper]) {
    return null;
  }

  return mapper[name as keyof typeof mapper];
};

const createFeedbackChatTool = CreateFeedbackArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Creating feedback...",
    defaultCompletedText: "Feedback created.",
  }),
);

const listFeedbackChatTool = ListFeedbackArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Listing feedback...",
    defaultCompletedText: "Feedback listed.",
  }),
);

const getFeedbackChatTool = GetFeedbackArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Getting feedback...",
    defaultCompletedText: "Feedback retrieved.",
  }),
);

const deleteFeedbackChatTool = DeleteFeedbackArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Deleting feedback...",
    defaultCompletedText: "Feedback deleted.",
  }),
);

export const vercelTool = (context: UserContext) => ({
  [FeedbackTool.CreateFeedback]: {
    description: createFeedbackTool.description,
    inputSchema: createFeedbackChatTool,
    execute: async (args: z.infer<typeof createFeedbackChatTool>) =>
      await createFeedback(context, args),
  },
  [FeedbackTool.ListFeedback]: {
    description: listFeedbackTool.description,
    inputSchema: listFeedbackChatTool,
    execute: async (args: z.infer<typeof listFeedbackChatTool>) =>
      await listFeedback(context),
  },
  [FeedbackTool.GetFeedback]: {
    description: getFeedbackTool.description,
    inputSchema: getFeedbackChatTool,
    execute: async (args: z.infer<typeof getFeedbackChatTool>) =>
      await getFeedback(context, args),
  },
  [FeedbackTool.DeleteFeedback]: {
    description: deleteFeedbackTool.description,
    inputSchema: deleteFeedbackChatTool,
    execute: async (args: z.infer<typeof deleteFeedbackChatTool>) =>
      await deleteFeedback(context, args),
  },
});
