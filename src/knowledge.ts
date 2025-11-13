import { z } from "zod";
import { chatToolHelperSchema, UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";

export enum KnowledgeTool {
  CreateKnowledge = "create_knowledge",
  ListKnowledge = "list_knowledge",
  GetKnowledge = "get_knowledge",
  DeleteKnowledge = "delete_knowledge",
}

// Schema definitions
export const CreateKnowledgeArgsSchema = z.object({
  title: z.string().describe("A short title for the knowledge"),
  description: z.string().describe("A short summary of the knowledge content"),
  content: z.string().describe("The full content of the knowledge"),
});

export const createKnowledgeTool = {
  name: KnowledgeTool.CreateKnowledge,
  description:
    "Create a new knowledge entry. Knowledge entries are text documents that can be used as references or information sources.",
  inputSchema: CreateKnowledgeArgsSchema,
};

export const createKnowledge = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = CreateKnowledgeArgsSchema.parse(body);

    const { title, description, content } = safeBody;

    const res = await squadClient(
      context.jwt,
    ).createKnowledge({
      orgId,
      workspaceId,
      createKnowledgePayload: {
        title,
        description,
        content,
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

// Schema for listing knowledge
export const ListKnowledgeArgsSchema = z.object({});

export const listKnowledgeTool = {
  name: KnowledgeTool.ListKnowledge,
  description:
    "List all knowledge entries in the workspace. Knowledge entries are text documents that can be used as references or information sources. List only shows the available items and a short description for the actual knowledge use the get by id call.",
  inputSchema: ListKnowledgeArgsSchema,
};

export const listKnowledge = async (
  context: UserContext,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const knowledge = await squadClient(
      context.jwt,
    ).listKnowledge({
      orgId,
      workspaceId,
    });

    if (knowledge.data.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No knowledge entries found.",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(knowledge),
        },
      ],
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

// Schema for getting a single knowledge entry
export const GetKnowledgeArgsSchema = z.object({
  knowledgeId: z.string().describe("The ID of the knowledge entry to retrieve"),
});

export const getKnowledgeTool = {
  name: KnowledgeTool.GetKnowledge,
  description:
    "Get details of a specific knowledge entry by ID. Knowledge entries are text documents that can be used as references or information sources.",
  inputSchema: GetKnowledgeArgsSchema,
};

export const getKnowledge = async (
  context: UserContext,
  args: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;

    const safeArgs = GetKnowledgeArgsSchema.parse(args);

    const { knowledgeId } = safeArgs;

    const knowledge = await squadClient(
      context.jwt,
    ).getKnowledge({
      orgId,
      workspaceId,
      knowledgeId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(knowledge),
        },
      ],
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

// Schema for deleting a knowledge entry
export const DeleteKnowledgeArgsSchema = z.object({
  knowledgeId: z.string().describe("The ID of the knowledge entry to delete"),
});

export const deleteKnowledgeTool = {
  name: KnowledgeTool.DeleteKnowledge,
  description: "Delete a knowledge entry by ID.",
  inputSchema: DeleteKnowledgeArgsSchema,
};

export const deleteKnowledge = async (
  context: UserContext,
  args: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;

    const safeArgs = DeleteKnowledgeArgsSchema.parse(args);

    const { knowledgeId } = safeArgs;

    const result = await squadClient(
      context.jwt,
    ).deleteKnowledge({
      orgId,
      workspaceId,
      knowledgeId,
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

export const knowledgeTools = [
  createKnowledgeTool,
  listKnowledgeTool,
  getKnowledgeTool,
  deleteKnowledgeTool,
];

const createKnowledgeChatTool = CreateKnowledgeArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Creating knowledge...",
    defaultCompletedText: "Knowledge created.",
  }),
);

const listKnowledgeChatTool = ListKnowledgeArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Listing knowledge...",
    defaultCompletedText: "Knowledge listed.",
  }),
);

const getKnowledgeChatTool = GetKnowledgeArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Getting knowledge...",
    defaultCompletedText: "Knowledge retrieved.",
  }),
);

const deleteKnowledgeChatTool = DeleteKnowledgeArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Deleting knowledge...",
    defaultCompletedText: "Knowledge deleted.",
  }),
);

export const runKnowledgeTool = (name: string) => {
  const mapper = {
    [KnowledgeTool.CreateKnowledge]: createKnowledge,
    [KnowledgeTool.ListKnowledge]: listKnowledge,
    [KnowledgeTool.GetKnowledge]: getKnowledge,
    [KnowledgeTool.DeleteKnowledge]: deleteKnowledge,
  };

  if (!mapper[name as keyof typeof mapper]) {
    return null;
  }
  return mapper[name as keyof typeof mapper];
};

export const vercelTool = (context: UserContext) => ({
  [KnowledgeTool.CreateKnowledge]: {
    description: createKnowledgeTool.description,
    inputSchema: createKnowledgeChatTool,
    execute: async (args: z.infer<typeof createKnowledgeChatTool>) =>
      await createKnowledge(context, args),
  },
  [KnowledgeTool.ListKnowledge]: {
    description: listKnowledgeTool.description,
    inputSchema: listKnowledgeChatTool,
    execute: async () => await listKnowledge(context),
  },
  [KnowledgeTool.GetKnowledge]: {
    description: getKnowledgeTool.description,
    inputSchema: getKnowledgeChatTool,
    execute: async (args: z.infer<typeof getKnowledgeChatTool>) =>
      await getKnowledge(context, args),
  },
  [KnowledgeTool.DeleteKnowledge]: {
    description: deleteKnowledgeTool.description,
    inputSchema: deleteKnowledgeChatTool,
    execute: async (args: z.infer<typeof deleteKnowledgeChatTool>) =>
      await deleteKnowledge(context, args),
  },
});
