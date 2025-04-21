import { z } from "zod";
import { squadClient } from "./lib/clients/squad.js";
import { UserContext } from "./helpers/getUser.js";
import { zodToJsonSchema } from "zod-to-json-schema";

// Schema definitions
export const CreateKnowledgeArgsSchema = z.object({
  title: z.string().describe("A short title for the knowledge"),
  description: z.string().describe("A short summary of the knowledge content"),
  content: z.string().describe("The full content of the knowledge"),
});

export const createKnowledgeTool = {
  name: "create_knowledge",
  description: "Create a new knowledge entry. Knowledge entries are text documents that can be used as references or information sources.",
  inputSchema: zodToJsonSchema(CreateKnowledgeArgsSchema),
};

export const createKnowledge = (context: UserContext) => async (body: z.infer<typeof CreateKnowledgeArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = CreateKnowledgeArgsSchema.parse(body);

    const { title, description, content } = safeBody;

    const res = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdKnowledgePost({
      orgId,
      workspaceId,
      createKnowledgePayload: {
        title,
        description,
        content
      }
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify(res, null, 2),
      }],
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
  description: "List all knowledge entries in the workspace. Knowledge entries are text documents that can be used as references or information sources. List only shows the available items and a short description for the actual knowledge use the get by id call.",
  inputSchema: zodToJsonSchema(ListKnowledgeArgsSchema),
};

export const listKnowledge = (context: UserContext) => async (
  _args: z.infer<typeof ListKnowledgeArgsSchema>
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const knowledge = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdKnowledgeGet({
      orgId,
      workspaceId,
    });

    if (knowledge.data.length === 0) {
      return {
        content: [{
          type: "text",
          text: "No knowledge entries found."
        }]
      };
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          knowledge,
        }, null, 2)
      }]
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
  description: "Get details of a specific knowledge entry by ID. Knowledge entries are text documents that can be used as references or information sources.",
  inputSchema: zodToJsonSchema(GetKnowledgeArgsSchema),
};

export const getKnowledge = (context: UserContext) => async ({
  knowledgeId
}: z.infer<typeof GetKnowledgeArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const knowledge = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdKnowledgeKnowledgeIdGet({
      orgId,
      workspaceId,
      knowledgeId
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify(knowledge, null, 2)
      }]
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
  inputSchema: zodToJsonSchema(DeleteKnowledgeArgsSchema),
};

export const deleteKnowledge = (context: UserContext) => async ({
  knowledgeId
}: z.infer<typeof DeleteKnowledgeArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const result = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdKnowledgeKnowledgeIdDelete({
      orgId,
      workspaceId,
      knowledgeId
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};
