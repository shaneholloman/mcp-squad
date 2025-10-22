import { beforeAll, afterAll, describe, it, expect } from "vitest";
import {
  createTestMCPClient,
  callTool,
  parseToolResponse,
  TestMCPClient,
} from "../helpers/test-client.js";
import { getApiKey } from "../setup.js";
import { generateTestInsight } from "../helpers/test-data.js";

describe("Insight Tools Integration Tests", () => {
  let testClient: TestMCPClient;
  let createdInsightId: string;

  beforeAll(async () => {
    const apiKey = getApiKey();
    testClient = await createTestMCPClient(apiKey);
  });

  afterAll(async () => {
    // Cleanup: delete the created insight
    if (createdInsightId) {
      try {
        await callTool(testClient.client, "delete_insight", {
          insightId: createdInsightId,
        });
      } catch (error) {
        console.error("Failed to cleanup test insight:", error);
      }
    }
    await testClient.cleanup();
  });

  it("should list available insight tools", async () => {
    const tools = await testClient.client.listTools();

    const insightTools = [
      "create_insight",
      "list_insights",
      "get_insight",
      "delete_insight",
    ];

    insightTools.forEach((toolName) => {
      const tool = tools.tools.find((t) => t.name === toolName);
      expect(tool).toBeDefined();
      expect(tool?.name).toBe(toolName);
    });
  });

  it("should create a new insight", async () => {
    const testData = generateTestInsight();

    const result = await callTool(testClient.client, "create_insight", testData);

    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);

    const response = parseToolResponse<{
      data: {
        id: string;
        type: string;
        title: string;
        description: string;
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBeDefined();
    expect(response.data.type).toBe(testData.type);
    expect(response.data.title).toBe(testData.title);
    expect(response.data.description).toBe(testData.description);

    createdInsightId = response.data.id;
  });

  it("should create insights with different types", async () => {
    const types = ["Feedback", "Bug", "FeatureRequest"] as const;
    const createdIds: string[] = [];

    try {
      for (const type of types) {
        const testData = {
          ...generateTestInsight(),
          type,
        };

        const result = await callTool(
          testClient.client,
          "create_insight",
          testData,
        );

        const response = parseToolResponse<{ data: { id: string; type: string } }>(
          result,
        );

        expect(response.data.type).toBe(type);
        createdIds.push(response.data.id);
      }
    } finally {
      // Cleanup
      for (const id of createdIds) {
        try {
          await callTool(testClient.client, "delete_insight", { insightId: id });
        } catch (error) {
          console.error("Failed to cleanup insight:", error);
        }
      }
    }
  });

  it("should list insights", async () => {
    const result = await callTool(testClient.client, "list_insights");

    expect(result.content).toBeDefined();

    const response = parseToolResponse<{
      data: Array<{ id: string; title: string }>;
    }>(result);

    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);

    // Should include our created insight
    const found = response.data.find((ins) => ins.id === createdInsightId);
    expect(found).toBeDefined();
  });

  it("should get a specific insight by ID", async () => {
    expect(createdInsightId).toBeDefined();

    const result = await callTool(testClient.client, "get_insight", {
      insightId: createdInsightId,
    });

    const response = parseToolResponse<{
      data: {
        id: string;
        type: string;
        title: string;
        description: string;
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdInsightId);
    expect(response.data.title).toBeDefined();
    expect(response.data.description).toBeDefined();
  });

  it("should get insight with relationships", async () => {
    expect(createdInsightId).toBeDefined();

    const result = await callTool(testClient.client, "get_insight", {
      insightId: createdInsightId,
      relationships: ["opportunities"],
    });

    const response = parseToolResponse<{
      data: { id: string; opportunities?: unknown[] };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdInsightId);
  });

  it("should delete an insight", async () => {
    // Create a new insight just for deletion test
    const testData = generateTestInsight();
    const createResult = await callTool(
      testClient.client,
      "create_insight",
      testData,
    );

    const createResponse = parseToolResponse<{ data: { id: string } }>(
      createResult,
    );
    const insightIdToDelete = createResponse.data.id;

    // Delete it
    const deleteResult = await callTool(testClient.client, "delete_insight", {
      insightId: insightIdToDelete,
    });

    const deleteResponse = parseToolResponse<{
      data: { id?: string; status?: string };
    }>(deleteResult);

    expect(deleteResponse.data).toBeDefined();
    // API may return either {status: "deleted"} or {id: "..."}
    if ('status' in deleteResponse.data) {
      expect(deleteResponse.data.status).toBe("deleted");
    } else {
      expect(deleteResponse.data.id).toBe(insightIdToDelete);
    }
  });
});
