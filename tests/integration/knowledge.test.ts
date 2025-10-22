import { beforeAll, afterAll, describe, it, expect } from "vitest";
import {
  createTestMCPClient,
  callTool,
  parseToolResponse,
  TestMCPClient,
} from "../helpers/test-client.js";
import { getApiKey } from "../setup.js";
import { generateTestKnowledge } from "../helpers/test-data.js";

describe("Knowledge Tools Integration Tests", () => {
  let testClient: TestMCPClient;
  let createdKnowledgeId: string;

  beforeAll(async () => {
    const apiKey = getApiKey();
    testClient = await createTestMCPClient(apiKey);
  });

  afterAll(async () => {
    // Cleanup: delete the created knowledge
    if (createdKnowledgeId) {
      try {
        await callTool(testClient.client, "delete_knowledge", {
          knowledgeId: createdKnowledgeId,
        });
      } catch (error) {
        console.error("Failed to cleanup test knowledge:", error);
      }
    }
    await testClient.cleanup();
  });

  it("should list available knowledge tools", async () => {
    const tools = await testClient.client.listTools();

    const knowledgeTools = [
      "create_knowledge",
      "list_knowledge",
      "get_knowledge",
      "delete_knowledge",
    ];

    knowledgeTools.forEach((toolName) => {
      const tool = tools.tools.find((t) => t.name === toolName);
      expect(tool).toBeDefined();
      expect(tool?.name).toBe(toolName);
    });
  });

  it("should create a new knowledge entry", async () => {
    const testData = generateTestKnowledge();

    const result = await callTool(
      testClient.client,
      "create_knowledge",
      testData,
    );

    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);

    const response = parseToolResponse<{
      data: { id: string; title: string; description: string; content: string };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBeDefined();
    expect(response.data.title).toBe(testData.title);
    expect(response.data.description).toBe(testData.description);
    expect(response.data.content).toBe(testData.content);

    createdKnowledgeId = response.data.id;
  });

  it("should list knowledge entries", async () => {
    const result = await callTool(testClient.client, "list_knowledge");

    expect(result.content).toBeDefined();

    const response = parseToolResponse<{
      data: Array<{ id: string; title: string; description: string }>;
    }>(result);

    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);

    // Should include our created knowledge
    const found = response.data.find((k) => k.id === createdKnowledgeId);
    expect(found).toBeDefined();
  });

  it("should get a specific knowledge entry by ID", async () => {
    expect(createdKnowledgeId).toBeDefined();

    const result = await callTool(testClient.client, "get_knowledge", {
      knowledgeId: createdKnowledgeId,
    });

    const response = parseToolResponse<{
      data: {
        id: string;
        title: string;
        description: string;
        txtFileUrl?: string;
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdKnowledgeId);
    expect(response.data.title).toBeDefined();
    expect(response.data.description).toBeDefined();
  });

  it("should delete a knowledge entry", async () => {
    // Create a new knowledge just for deletion test
    const testData = generateTestKnowledge();
    const createResult = await callTool(
      testClient.client,
      "create_knowledge",
      testData,
    );

    const createResponse = parseToolResponse<{ data: { id: string } }>(
      createResult,
    );
    const knowledgeIdToDelete = createResponse.data.id;

    // Delete it
    const deleteResult = await callTool(testClient.client, "delete_knowledge", {
      knowledgeId: knowledgeIdToDelete,
    });

    const deleteResponse = parseToolResponse<{
      data: { status?: string; id?: string; message?: string };
    }>(deleteResult);

    expect(deleteResponse.data).toBeDefined();
    // API may return {message: "..."}, {status: "deleted"}, or {id: "..."}
    if ('message' in deleteResponse.data) {
      expect(deleteResponse.data.message).toContain("deleted");
    } else if ('status' in deleteResponse.data) {
      expect(deleteResponse.data.status).toBe("deleted");
    } else if ('id' in deleteResponse.data) {
      expect(deleteResponse.data.id).toBe(knowledgeIdToDelete);
    }
  });
});
