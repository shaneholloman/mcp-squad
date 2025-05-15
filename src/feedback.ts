import { z } from "zod";
import { chatToolHelperSchema, UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";

export enum FeedbackTool {
  CreateFeedback = "create_feedback",
  ListFeedback = "list_feedback",
  GetFeedback = "get_feedback",
  DeleteFeedback = "delete_feedback",
}

// Schema definitions
export const CreateFeedbackArgsSchema = z.object({
  feedbackSource: z
    .string()
    .describe(
      "The source of the feedback, e.g. Amplitude, Typeform, AI, Questionaire etc",
    ),
  body: z.string().describe("The full content of the feedback"),
});

export const createFeedbackTool = {
  name: FeedbackTool.CreateFeedback,
  description:
    "Create a new feedback entry. Feedback is a customer created insight into your product. This is often in the form of a review, survey, or questionnaire.",
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
    ).organisationsOrgIdWorkspacesWorkspaceIdDataIngressFeedbackSourcePost({
      orgId,
      workspaceId,
      feedbackSource: safeBody.feedbackSource,
      body: safeBody.body,
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

// Schema for listing knowledge
export const ListFeedbackArgsSchema = z.object({});

export const listFeedbackTool = {
  name: FeedbackTool.ListFeedback,
  description:
    "List all feedback for the workspace. This feedback is gathered from various sources, is created by our customers and helps us understand how to improve the business.",
  inputSchema: ListFeedbackArgsSchema,
};

export const listFeedback = async (
  context: UserContext,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const feedback = await squadClient(
      context.jwt,
    ).organisationsOrgIdWorkspacesWorkspaceIdFeedbackGet({
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
    .enum(["opportunities", "solutions", "requirements", "outcomes"])
    .optional()
    .describe("Show other entities that this feedback is related to."),
});

export const getFeedbackTool = {
  name: FeedbackTool.GetFeedback,
  description:
    "Get details of a specific feedback entry by ID. Feedback entries are text documents that can be used as references or information sources.",
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
    ).organisationsOrgIdWorkspacesWorkspaceIdFeedbackFeedbackIdGet({
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

// Schema for deleting a knowledge entry
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
    ).organisationsOrgIdWorkspacesWorkspaceIdFeedbackFeedbackIdDelete({
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
    parameters: createFeedbackChatTool,
    execute: async (args: z.infer<typeof createFeedbackChatTool>) =>
      await createFeedback(context, args),
  },
  [FeedbackTool.ListFeedback]: {
    description: listFeedbackTool.description,
    parameters: listFeedbackChatTool,
    execute: async (args: z.infer<typeof listFeedbackChatTool>) =>
      await listFeedback(context),
  },
  [FeedbackTool.GetFeedback]: {
    description: getFeedbackTool.description,
    parameters: getFeedbackChatTool,
    execute: async (args: z.infer<typeof getFeedbackChatTool>) =>
      await getFeedback(context, args),
  },
  [FeedbackTool.DeleteFeedback]: {
    description: deleteFeedbackTool.description,
    parameters: deleteFeedbackChatTool,
    execute: async (args: z.infer<typeof deleteFeedbackChatTool>) =>
      await deleteFeedback(context, args),
  },
});
