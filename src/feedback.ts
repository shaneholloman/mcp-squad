import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";

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
  name: "create_feedback",
  description:
    "Create a new feedback entry. Feedback is a customer created insight into your product. This is often in the form of a review, survey, or questionnaire.",
  inputSchema: zodToJsonSchema(CreateFeedbackArgsSchema),
};

export const createFeedback = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = CreateFeedbackArgsSchema.parse(body);

    const res =
      await squadClient(context.jwt).organisationsOrgIdWorkspacesWorkspaceIdDataIngressFeedbackSourcePost(
        {
          orgId,
          workspaceId,
          feedbackSource: safeBody.feedbackSource,
          body: safeBody.body,
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
    console.error("error", e);
    throw e;
  }
};

// Schema for listing knowledge
export const ListFeedbackArgsSchema = z.object({});

export const listFeedbackTool = {
  name: "list_feedback",
  description:
    "List all feedback for the workspace. This feedback is gathered from various sources, is created by our customers and helps us understand how to improve the business.",
  inputSchema: zodToJsonSchema(ListFeedbackArgsSchema),
};

export const listFeedback = async (
  context: UserContext,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const feedback =
      await squadClient(context.jwt).organisationsOrgIdWorkspacesWorkspaceIdFeedbackGet({
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
          text: JSON.stringify(
            {
              feedback,
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

// Schema for getting a single feedback entry
export const GetFeedbackArgsSchema = z.object({
  feedbackId: z.string().describe("The ID of the feedback entry to retrieve"),
  relationships: z
    .enum(["opportunities", "solutions", "requirements", "outcomes"])
    .optional()
    .describe("Show other entities that this feedback is related to."),
});

export const getFeedbackTool = {
  name: "get_feedback",
  description:
    "Get details of a specific feedback entry by ID. Feedback entries are text documents that can be used as references or information sources.",
  inputSchema: zodToJsonSchema(GetFeedbackArgsSchema),
};

export const getFeedback = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = GetFeedbackArgsSchema.parse(body);

    const feedback =
      await squadClient(context.jwt).organisationsOrgIdWorkspacesWorkspaceIdFeedbackFeedbackIdGet(
        {
          orgId,
          workspaceId,
          feedbackId: safeBody.feedbackId,
          relationships: safeBody.relationships,
        },
      );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(feedback, null, 2),
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
  name: "delete_feedback",
  description: "Delete a feedback entry by ID.",
  inputSchema: zodToJsonSchema(DeleteFeedbackArgsSchema),
};

export const deleteFeedback = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = DeleteFeedbackArgsSchema.parse(body);

    const feedbackId = safeBody.feedbackId;

    const result =
      await squadClient(context.jwt).organisationsOrgIdWorkspacesWorkspaceIdFeedbackFeedbackIdDelete(
        {
          orgId,
          workspaceId,
          feedbackId,
        },
      );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
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
    create_feedback: createFeedback,
    list_feedback: listFeedback,
    get_feedback: getFeedback,
    delete_feedback: deleteFeedback,
  };

  if (!mapper[name as keyof typeof mapper]) {
    return null;
  }

  return mapper[name as keyof typeof mapper];
};

export const vercelTool = (context: UserContext) => ({
  create_feedback: {
    description: createFeedbackTool.description,
    parameters: createFeedbackTool.inputSchema,
    execute: (args: z.infer<typeof CreateFeedbackArgsSchema>) => createFeedback(context, args),
  },
  list_feedback: {
    description: listFeedbackTool.description,
    parameters: listFeedbackTool.inputSchema,
    execute: () => listFeedback(context),
  },
  get_feedback: {
    description: getFeedbackTool.description,
    parameters: getFeedbackTool.inputSchema,
    execute: (args: z.infer<typeof GetFeedbackArgsSchema>) => getFeedback(context, args),
  },
  delete_feedback: {
    description: deleteFeedbackTool.description,
    parameters: deleteFeedbackTool.inputSchema,
    execute: (args: z.infer<typeof DeleteFeedbackArgsSchema>) => deleteFeedback(context, args),
  },
})
  