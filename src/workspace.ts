import { z } from "zod";
import { squadClient } from "./lib/clients/squad.js";
import { UserContext } from "./helpers/getUser.js";
import { UpdateWorkspacePayload } from "./lib/openapi/squad/models/index.js";
import { zodToJsonSchema } from "zod-to-json-schema";

// Schema for getting a workspace
export const GetWorkspaceArgsSchema = z.object({
  workspaceId: z.string().describe("The ID of the workspace to retrieve"),
});

export const getWorkspaceTool = {
  name: "get_workspace",
  description: "Get details of a specific workspace by ID. Workspaces contain the project name, detailed description, and mission statement.",
  inputSchema: zodToJsonSchema(GetWorkspaceArgsSchema),
};

export const getWorkspace = (context: UserContext) => async ({
  workspaceId
}: z.infer<typeof GetWorkspaceArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId } = context;

    const workspace = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdGet({
      orgId,
      workspaceId
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify(workspace, null, 2)
      }]
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

// Schema for updating a workspace
export const UpdateWorkspaceArgsSchema = z.object({
  workspaceId: z.string().describe("The ID of the workspace to update"),
  name: z.string().optional().describe("Updated name for the workspace"),
  homepageUrl: z.string().optional().describe("Updated URL to the workspace's homepage"),
  logoUrl: z.string().optional().describe("Updated URL to the workspace's logo"),
  missionStatement: z.string().optional().describe("Updated mission statement for the workspace"),
  description: z.string().optional().describe("Updated detailed description of the workspace"),
  outcomes: z.array(z.string()).optional().describe("Updated list of outcome IDs associated with this workspace"),
});

export const updateWorkspaceTool = {
  name: "update_workspace",
  description: "Update an existing workspace's details such as name, description, mission statement, or associated outcomes.",
  inputSchema: zodToJsonSchema(UpdateWorkspaceArgsSchema),
};

export const updateWorkspace = (context: UserContext) => async (body: z.infer<typeof UpdateWorkspaceArgsSchema>): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId } = context;

    const safeBody = UpdateWorkspaceArgsSchema.parse(body);

    const { workspaceId, name, homepageUrl, logoUrl, missionStatement, description, outcomes } = safeBody;

    const updatePayload: UpdateWorkspacePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (homepageUrl !== undefined) updatePayload.homepageUrl = homepageUrl;
    if (logoUrl !== undefined) updatePayload.logoUrl = logoUrl;
    if (missionStatement !== undefined) updatePayload.missionStatement = missionStatement;
    if (description !== undefined) updatePayload.description = description;
    if (outcomes !== undefined) updatePayload.outcomes = outcomes;

    const workspace = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdPut({
      orgId,
      workspaceId,
      updateWorkspacePayload: updatePayload
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify(workspace, null, 2)
      }]
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};
