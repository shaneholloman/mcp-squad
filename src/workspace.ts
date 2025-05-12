import { z, ZodError } from "zod";
import { chatToolHelperSchema, UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";
import { UpdateWorkspacePayload } from "./lib/openapi/squad/models/index.js";

export enum WorkspaceTool {
  GetWorkspace = "get_workspace",
  UpdateWorkspace = "update_workspace",
}

const getWorkspaceSchema = z.object({});

export const getWorkspaceTool = {
  name: WorkspaceTool.GetWorkspace,
  description:
    "Get details of a specific workspace by ID. Workspaces contain the project name, detailed description, and mission statement.",
  inputSchema: getWorkspaceSchema,
};

export const getWorkspace = async (
  context: UserContext,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const workspace = await squadClient(
      context.jwt,
    ).organisationsOrgIdWorkspacesWorkspaceIdGet({
      orgId,
      workspaceId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(workspace, null, 2),
        },
      ],
    };
  } catch (e) {
    return {
      content: [
        {
          type: "text",
          text: "I was unable to retrieve this workspace. Please check that the ID is correct.",
        },
      ],
    };
  }
};

// Schema for updating a workspace
export const UpdateWorkspaceArgsSchema = z.object({
  workspaceId: z.string().describe("The ID of the workspace to update"),
  name: z.string().optional().describe("Updated name for the workspace"),
  homepageUrl: z
    .string()
    .optional()
    .describe("Updated URL to the workspace's homepage"),
  logoUrl: z
    .string()
    .optional()
    .describe("Updated URL to the workspace's logo"),
  missionStatement: z
    .string()
    .optional()
    .describe("Updated mission statement for the workspace"),
  description: z
    .string()
    .optional()
    .describe("Updated detailed description of the workspace"),
  outcomes: z
    .array(z.string())
    .optional()
    .describe("Updated list of outcome IDs associated with this workspace"),
});

export const updateWorkspaceTool = {
  name: WorkspaceTool.UpdateWorkspace,
  description:
    "Update an existing workspace's details such as name, description, mission statement, or associated outcomes.",
  inputSchema: UpdateWorkspaceArgsSchema,
};

export const updateWorkspace = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId } = context;

    const safeBody = UpdateWorkspaceArgsSchema.parse(body);

    const {
      workspaceId,
      name,
      homepageUrl,
      logoUrl,
      missionStatement,
      description,
      outcomes,
    } = safeBody;

    const updatePayload: UpdateWorkspacePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (homepageUrl !== undefined) updatePayload.homepageUrl = homepageUrl;
    if (logoUrl !== undefined) updatePayload.logoUrl = logoUrl;
    if (missionStatement !== undefined)
      updatePayload.missionStatement = missionStatement;
    if (description !== undefined) updatePayload.description = description;
    if (outcomes !== undefined) updatePayload.outcomes = outcomes;

    const workspace = await squadClient(
      context.jwt,
    ).organisationsOrgIdWorkspacesWorkspaceIdPut({
      orgId,
      workspaceId,
      updateWorkspacePayload: updatePayload,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(workspace, null, 2),
        },
      ],
    };
  } catch (e) {
    if (e instanceof ZodError) {
      return {
        content: [
          {
            type: "text",
            text:
              "I was unable to update this workspace. Please check that all values are valid. " +
              e.errors.map(e => e.message).join(", "),
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: "I was unable to update this workspace. Please check that all IDs are correct.",
        },
      ],
    };
  }
};

export const workspaceTool = [getWorkspaceTool, updateWorkspaceTool];

export const runWorkspaceTool = (name: string) => {
  const mapper = {
    [WorkspaceTool.GetWorkspace]: getWorkspace,
    [WorkspaceTool.UpdateWorkspace]: updateWorkspace,
  };

  if (!mapper[name as keyof typeof mapper]) {
    return null;
  }
  return mapper[name as keyof typeof mapper];
};

const getWorkspaceChatTool = getWorkspaceSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Retrieving workspace...",
    defaultCompletedText: "Workspace retrieved.",
  }),
);

const updateWorkspaceChatTool = UpdateWorkspaceArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Updating workspace...",
    defaultCompletedText: "Workspace updated.",
  }),
);

export const vercelTool = (context: UserContext) => ({
  [WorkspaceTool.GetWorkspace]: {
    description: getWorkspaceTool.description,
    parameters: getWorkspaceChatTool,
    execute: async (args: z.infer<typeof getWorkspaceChatTool>) =>
      await getWorkspace(context),
  },
  [WorkspaceTool.UpdateWorkspace]: {
    description: updateWorkspaceTool.description,
    parameters: updateWorkspaceChatTool,
    execute: async (args: z.infer<typeof updateWorkspaceChatTool>) =>
      await updateWorkspace(context, args),
  },
});
