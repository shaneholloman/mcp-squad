import { z } from "zod";
import { UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";

// Schema definitions
export const CreateKnowledgeArgsSchema = z.object({
  title: z.string().describe("A short title for the knowledge"),
  description: z.string().describe("A short summary of the knowledge content"),
  content: z.string().describe("The full content of the knowledge"),
});

export const createKnowledgeTool = {
  name: "create_knowledge",
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
    ).organisationsOrgIdWorkspacesWorkspaceIdKnowledgePost({
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
export const ListKnowledgeArgsSchema = z.object({});

export const listKnowledgeTool = {
  name: "list_knowledge",
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
    ).organisationsOrgIdWorkspacesWorkspaceIdKnowledgeGet({
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
          text: JSON.stringify(
            {
              knowledge,
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

// Schema for getting a single knowledge entry
export const GetKnowledgeArgsSchema = z.object({
  knowledgeId: z.string().describe("The ID of the knowledge entry to retrieve"),
});

export const getKnowledgeTool = {
  name: "get_knowledge",
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
    ).organisationsOrgIdWorkspacesWorkspaceIdKnowledgeKnowledgeIdGet({
      orgId,
      workspaceId,
      knowledgeId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(knowledge, null, 2),
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
  name: "delete_knowledge",
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
    ).organisationsOrgIdWorkspacesWorkspaceIdKnowledgeKnowledgeIdDelete({
      orgId,
      workspaceId,
      knowledgeId,
    });

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

export const knowledgeTools = [
  createKnowledgeTool,
  listKnowledgeTool,
  getKnowledgeTool,
  deleteKnowledgeTool,
];

export const runKnowledgeTool = (name: string) => {
  const mapper = {
    create_knowledge: createKnowledge,
    list_knowledge: listKnowledge,
    get_knowledge: getKnowledge,
    delete_knowledge: deleteKnowledge,
  };

  if (!mapper[name as keyof typeof mapper]) {
    return null;
  }
  return mapper[name as keyof typeof mapper];
};

export const vercelTool = (context: UserContext) => ({
  create_knowledge: {
    description: createKnowledgeTool.description,
    parameters: createKnowledgeTool.inputSchema,
    execute: async (args: z.infer<typeof CreateKnowledgeArgsSchema>) =>
      await createKnowledge(context, args),
  },
  list_knowledge: {
    description: listKnowledgeTool.description,
    parameters: listKnowledgeTool.inputSchema,
    execute: async () => await listKnowledge(context),
  },
  get_knowledge: {
    description: getKnowledgeTool.description,
    parameters: getKnowledgeTool.inputSchema,
    execute: async (args: z.infer<typeof GetKnowledgeArgsSchema>) =>
      await getKnowledge(context, args),
  },
  delete_knowledge: {
    description: deleteKnowledgeTool.description,
    parameters: deleteKnowledgeTool.inputSchema,
    execute: async (args: z.infer<typeof DeleteKnowledgeArgsSchema>) =>
      await deleteKnowledge(context, args),
  },
});
