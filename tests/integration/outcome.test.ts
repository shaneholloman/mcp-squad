import { beforeAll, afterAll, describe, it, expect } from "vitest";
import {
  createTestMCPClient,
  callTool,
  parseToolResponse,
  TestMCPClient,
} from "../helpers/test-client.js";
import { getApiKey } from "../setup.js";
import { generateTestOutcome } from "../helpers/test-data.js";

describe("Outcome Tools Integration Tests", () => {
  let testClient: TestMCPClient;
  let createdOutcomeId: string;

  beforeAll(async () => {
    const apiKey = getApiKey();
    testClient = await createTestMCPClient(apiKey);
  });

  afterAll(async () => {
    // Cleanup: delete the created outcome
    if (createdOutcomeId) {
      try {
        await callTool(testClient.client, "delete_outcome", {
          outcomeId: createdOutcomeId,
        });
      } catch (error) {
        console.error("Failed to cleanup test outcome:", error);
      }
    }
    await testClient.cleanup();
  });

  it("should list available outcome tools", async () => {
    const tools = await testClient.client.listTools();

    const outcomeTools = [
      "create_outcome",
      "list_outcomes",
      "get_outcome",
      "update_outcome",
      "delete_outcome",
      "manage_outcome_relationships",
    ];

    outcomeTools.forEach((toolName) => {
      const tool = tools.tools.find((t) => t.name === toolName);
      expect(tool).toBeDefined();
      expect(tool?.name).toBe(toolName);
    });
  });

  it("should create a new outcome", async () => {
    const testData = generateTestOutcome();

    const result = await callTool(testClient.client, "create_outcome", testData);

    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);

    const response = parseToolResponse<{
      data: { id: string; title: string; description: string };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBeDefined();
    expect(response.data.title).toBe(testData.title);
    expect(response.data.description).toBe(testData.description);

    createdOutcomeId = response.data.id;
  });

  it("should list outcomes", async () => {
    const result = await callTool(testClient.client, "list_outcomes");

    expect(result.content).toBeDefined();

    const response = parseToolResponse<{
      data: Array<{ id: string; title: string }>;
    }>(result);

    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);

    // Should include our created outcome
    const found = response.data.find((out) => out.id === createdOutcomeId);
    expect(found).toBeDefined();
  });

  it("should get a specific outcome by ID", async () => {
    expect(createdOutcomeId).toBeDefined();

    const result = await callTool(testClient.client, "get_outcome", {
      outcomeId: createdOutcomeId,
    });

    const response = parseToolResponse<{
      data: { id: string; title: string; description: string };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdOutcomeId);
    expect(response.data.title).toBeDefined();
    expect(response.data.description).toBeDefined();
  });

  it("should get outcome with relationships", async () => {
    expect(createdOutcomeId).toBeDefined();

    const result = await callTool(testClient.client, "get_outcome", {
      outcomeId: createdOutcomeId,
      relationships: ["opportunities", "solutions", "insights"],
    });

    const response = parseToolResponse<{
      data: {
        id: string;
        opportunities?: unknown[];
        solutions?: unknown[];
        insights?: unknown[];
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdOutcomeId);
  });

  it("should update an outcome", async () => {
    expect(createdOutcomeId).toBeDefined();

    const updatedTitle = `Updated ${generateTestOutcome().title}`;
    const updatedDescription = "This outcome has been updated during testing";

    const result = await callTool(testClient.client, "update_outcome", {
      outcomeId: createdOutcomeId,
      title: updatedTitle,
      description: updatedDescription,
      priority: 5,
      trend: 10,
    });

    const response = parseToolResponse<{
      data: {
        id: string;
        title: string;
        description: string;
        priority?: number;
        trend?: number;
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdOutcomeId);
    expect(response.data.title).toBe(updatedTitle);
    expect(response.data.description).toBe(updatedDescription);
  });

  it("should delete an outcome", async () => {
    // Create a new outcome just for deletion test
    const testData = generateTestOutcome();
    const createResult = await callTool(
      testClient.client,
      "create_outcome",
      testData,
    );

    const createResponse = parseToolResponse<{ data: { id: string } }>(
      createResult,
    );
    const outcomeIdToDelete = createResponse.data.id;

    // Delete it
    const deleteResult = await callTool(testClient.client, "delete_outcome", {
      outcomeId: outcomeIdToDelete,
    });

    const deleteResponse = parseToolResponse<{ data: { id: string } }>(
      deleteResult,
    );

    expect(deleteResponse.data).toBeDefined();
    expect(deleteResponse.data.id).toBe(outcomeIdToDelete);
  });
});
