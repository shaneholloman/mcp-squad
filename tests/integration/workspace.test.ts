import { beforeAll, afterAll, describe, it, expect } from "vitest";
import {
  createTestMCPClient,
  callTool,
  parseToolResponse,
  TestMCPClient,
} from "../helpers/test-client.js";
import { getApiKey } from "../setup.js";

describe("Workspace Tools Integration Tests", () => {
  let testClient: TestMCPClient;

  beforeAll(async () => {
    const apiKey = getApiKey();
    testClient = await createTestMCPClient(apiKey);
  });

  afterAll(async () => {
    await testClient.cleanup();
  });

  it("should list available workspace tools", async () => {
    const tools = await testClient.client.listTools();

    const workspaceTools = ["get_workspace", "update_workspace"];

    workspaceTools.forEach((toolName) => {
      const tool = tools.tools.find((t) => t.name === toolName);
      expect(tool).toBeDefined();
      expect(tool?.name).toBe(toolName);
    });
  });

  it("should get workspace details", async () => {
    const result = await callTool(testClient.client, "get_workspace");

    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);

    const response = parseToolResponse<{
      data: {
        id: string;
        name?: string;
        description?: string;
        missionStatement?: string;
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBeDefined();
  });

  it("should update workspace details", async () => {
    // First, get the current workspace to get the ID
    const getResult = await callTool(testClient.client, "get_workspace");
    const getResponse = parseToolResponse<{ data: { id: string } }>(getResult);
    const workspaceId = getResponse.data.id;

    const updatedName = `Test Workspace ${Date.now()}`;
    const updatedDescription =
      "This workspace has been updated during integration testing";
    const updatedMissionStatement =
      "Our mission is to test the Squad MCP server thoroughly";

    const updateResult = await callTool(testClient.client, "update_workspace", {
      workspaceId,
      name: updatedName,
      description: updatedDescription,
      missionStatement: updatedMissionStatement,
    });

    const updateResponse = parseToolResponse<{
      data: {
        id: string;
        name: string;
        description: string;
        missionStatement: string;
      };
    }>(updateResult);

    expect(updateResponse.data).toBeDefined();
    expect(updateResponse.data.id).toBe(workspaceId);
    expect(updateResponse.data.name).toBe(updatedName);
    expect(updateResponse.data.description).toBe(updatedDescription);
    expect(updateResponse.data.missionStatement).toBe(updatedMissionStatement);
  });
});
