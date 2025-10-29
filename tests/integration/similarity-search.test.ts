import { beforeAll, afterAll, describe, it, expect } from "vitest";
import {
  createTestMCPClient,
  callTool,
  parseToolResponse,
  TestMCPClient,
} from "../helpers/test-client.js";
import { getApiKey } from "../setup.js";
import {
  generateTestKnowledge,
  generateTestOpportunity,
  generateTestInsight,
} from "../helpers/test-data.js";

describe("Similarity Search Integration Tests", () => {
  let testClient: TestMCPClient;
  let createdKnowledgeId: string;
  let createdOpportunityId: string;
  let createdInsightId: string;

  beforeAll(async () => {
    const apiKey = getApiKey();
    testClient = await createTestMCPClient(apiKey);

    // Create some test data for search
    const knowledgeData = generateTestKnowledge();
    const knowledgeResult = await callTool(
      testClient.client,
      "create_knowledge",
      knowledgeData,
    );
    const knowledgeResponse = parseToolResponse<{ data: { id: string } }>(
      knowledgeResult,
    );
    createdKnowledgeId = knowledgeResponse.data.id;

    const opportunityData = generateTestOpportunity();
    const opportunityResult = await callTool(
      testClient.client,
      "create_opportunity",
      opportunityData,
    );
    const opportunityResponse = parseToolResponse<{ data: { id: string } }>(
      opportunityResult,
    );
    createdOpportunityId = opportunityResponse.data.id;

    const insightData = generateTestInsight();
    const insightResult = await callTool(
      testClient.client,
      "create_insight",
      insightData,
    );
    const insightResponse = parseToolResponse<{ data: { id: string } }>(
      insightResult,
    );
    createdInsightId = insightResponse.data.id;
  });

  afterAll(async () => {
    // Cleanup
    try {
      if (createdKnowledgeId) {
        await callTool(testClient.client, "delete_knowledge", {
          knowledgeId: createdKnowledgeId,
        });
      }
      if (createdOpportunityId) {
        await callTool(testClient.client, "delete_opportunity", {
          opportunityId: createdOpportunityId,
        });
      }
      if (createdInsightId) {
        await callTool(testClient.client, "delete_insight", {
          insightId: createdInsightId,
        });
      }
    } catch (error) {
      console.error("Failed to cleanup test data:", error);
    }
    await testClient.cleanup();
  });

  it("should list similarity_search tool", async () => {
    const tools = await testClient.client.listTools();

    const tool = tools.tools.find((t) => t.name === "similarity_search");
    expect(tool).toBeDefined();
    expect(tool?.name).toBe("similarity_search");
  });

  it("should perform similarity search across all content types", async () => {
    const result = await callTool(testClient.client, "similarity_search", {
      query: "test",
      filters: ["knowledge-base", "insights", "opportunities", "solutions"],
    });

    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);

    const response = parseToolResponse<{
      data: {
        opportunities: unknown[];
        knowledge: unknown[];
        insights: unknown[];
        solutions: unknown[];
        totalResults: number;
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data.totalResults).toBeGreaterThan(0);
  });

  it("should search only knowledge-base when filtered", async () => {
    const result = await callTool(testClient.client, "similarity_search", {
      query: "test knowledge",
      filters: ["knowledge-base"],
    });

    expect(result.content).toBeDefined();

    const response = parseToolResponse<{
      data: {
        knowledge: unknown[];
        totalResults: number;
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.knowledge)).toBe(true);
  });

  it("should search only insights when filtered", async () => {
    const result = await callTool(testClient.client, "similarity_search", {
      query: "test feedback customer",
      filters: ["insights"],
    });

    expect(result.content).toBeDefined();

    const response = parseToolResponse<{
      data: {
        insights: unknown[];
        totalResults: number;
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.insights)).toBe(true);
  });

  it("should search only opportunities when filtered", async () => {
    const result = await callTool(testClient.client, "similarity_search", {
      query: "test opportunity",
      filters: ["opportunities"],
    });

    expect(result.content).toBeDefined();

    const response = parseToolResponse<{
      data: {
        opportunities: unknown[];
        totalResults: number;
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.opportunities)).toBe(true);
  });

  it("should search with multiple filters", async () => {
    const result = await callTool(testClient.client, "similarity_search", {
      query: "test",
      filters: ["knowledge-base", "opportunities"],
    });

    expect(result.content).toBeDefined();

    const response = parseToolResponse<{
      data: {
        knowledge: unknown[];
        opportunities: unknown[];
        totalResults: number;
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data.totalResults).toBeGreaterThan(0);
  });
});
