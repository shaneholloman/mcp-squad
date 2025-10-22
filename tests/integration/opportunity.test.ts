import { beforeAll, afterAll, describe, it, expect } from "vitest";
import {
  createTestMCPClient,
  callTool,
  parseToolResponse,
  TestMCPClient,
} from "../helpers/test-client.js";
import { getApiKey } from "../setup.js";
import { generateTestOpportunity } from "../helpers/test-data.js";

describe("Opportunity Tools Integration Tests", () => {
  let testClient: TestMCPClient;
  let createdOpportunityId: string;

  beforeAll(async () => {
    const apiKey = getApiKey();
    testClient = await createTestMCPClient(apiKey);
  });

  afterAll(async () => {
    // Cleanup: delete the created opportunity
    if (createdOpportunityId) {
      try {
        await callTool(testClient.client, "delete_opportunity", {
          opportunityId: createdOpportunityId,
        });
      } catch (error) {
        console.error("Failed to cleanup test opportunity:", error);
      }
    }
    await testClient.cleanup();
  });

  it("should list available tools including opportunity tools", async () => {
    const tools = await testClient.client.listTools();

    const opportunityTools = [
      "create_opportunity",
      "list_opportunities",
      "get_opportunity",
      "update_opportunity",
      "delete_opportunity",
      "generate_solutions",
      "manage_opportunity_relationships",
    ];

    opportunityTools.forEach((toolName) => {
      const tool = tools.tools.find((t) => t.name === toolName);
      expect(tool).toBeDefined();
      expect(tool?.name).toBe(toolName);
    });
  });

  it("should create a new opportunity", async () => {
    const testData = generateTestOpportunity();

    const result = await callTool(
      testClient.client,
      "create_opportunity",
      testData,
    );

    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);

    const response = parseToolResponse<{
      data: { id: string; title: string; description: string };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBeDefined();
    expect(response.data.title).toBe(testData.title);
    expect(response.data.description).toBe(testData.description);

    createdOpportunityId = response.data.id;
  });

  it("should list opportunities", async () => {
    const result = await callTool(testClient.client, "list_opportunities");

    expect(result.content).toBeDefined();

    const response = parseToolResponse<{
      data: Array<{ id: string; title: string }>;
    }>(result);

    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);

    // Should include our created opportunity
    const found = response.data.find((opp) => opp.id === createdOpportunityId);
    expect(found).toBeDefined();
  });

  it("should get a specific opportunity by ID", async () => {
    expect(createdOpportunityId).toBeDefined();

    const result = await callTool(testClient.client, "get_opportunity", {
      opportunityId: createdOpportunityId,
    });

    const response = parseToolResponse<{
      data: { id: string; title: string; description: string };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdOpportunityId);
    expect(response.data.title).toBeDefined();
    expect(response.data.description).toBeDefined();
  });

  it("should get opportunity with relationships", async () => {
    expect(createdOpportunityId).toBeDefined();

    const result = await callTool(testClient.client, "get_opportunity", {
      opportunityId: createdOpportunityId,
      relationships: ["solutions", "outcomes", "insights"],
    });

    const response = parseToolResponse<{
      data: {
        id: string;
        solutions?: unknown[];
        outcomes?: unknown[];
        insights?: unknown[];
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdOpportunityId);
  });

  it("should update an opportunity", async () => {
    expect(createdOpportunityId).toBeDefined();

    const updatedTitle = `Updated ${generateTestOpportunity().title}`;
    const updatedDescription = "This opportunity has been updated during testing";

    const result = await callTool(testClient.client, "update_opportunity", {
      opportunityId: createdOpportunityId,
      title: updatedTitle,
      description: updatedDescription,
      status: "InProgress",
    });

    const response = parseToolResponse<{
      data: { id: string; title: string; description: string; status: string };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdOpportunityId);
    expect(response.data.title).toBe(updatedTitle);
    expect(response.data.description).toBe(updatedDescription);
    expect(response.data.status).toBe("InProgress");
  });

  it("should generate solutions for an opportunity", async () => {
    expect(createdOpportunityId).toBeDefined();

    const result = await callTool(testClient.client, "generate_solutions", {
      opportunityId: createdOpportunityId,
    });

    expect(result.content).toBeDefined();

    const response = parseToolResponse<{ data: { id: string } }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdOpportunityId);
  });

  it("should delete an opportunity", async () => {
    // Create a new opportunity just for deletion test
    const testData = generateTestOpportunity();
    const createResult = await callTool(
      testClient.client,
      "create_opportunity",
      testData,
    );

    const createResponse = parseToolResponse<{ data: { id: string } }>(
      createResult,
    );
    const opportunityIdToDelete = createResponse.data.id;

    // Delete it
    const deleteResult = await callTool(
      testClient.client,
      "delete_opportunity",
      {
        opportunityId: opportunityIdToDelete,
      },
    );

    const deleteResponse = parseToolResponse<{ data: { id: string } }>(
      deleteResult,
    );

    expect(deleteResponse.data).toBeDefined();
    expect(deleteResponse.data.id).toBe(opportunityIdToDelete);
  });
});
