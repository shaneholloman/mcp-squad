import { beforeAll, afterAll, describe, it, expect } from "vitest";
import {
  createTestMCPClient,
  callTool,
  parseToolResponse,
  TestMCPClient,
} from "../helpers/test-client.js";
import { getApiKey } from "../setup.js";
import { generateTestSolution } from "../helpers/test-data.js";

describe("Solution Tools Integration Tests", () => {
  let testClient: TestMCPClient;
  let createdSolutionId: string;

  beforeAll(async () => {
    const apiKey = getApiKey();
    testClient = await createTestMCPClient(apiKey);
  });

  afterAll(async () => {
    // Cleanup: delete the created solution
    if (createdSolutionId) {
      try {
        await callTool(testClient.client, "delete_solution", {
          solutionId: createdSolutionId,
        });
      } catch (error) {
        console.error("Failed to cleanup test solution:", error);
      }
    }
    await testClient.cleanup();
  });

  it("should list available solution tools", async () => {
    const tools = await testClient.client.listTools();

    const solutionTools = [
      "create_solution",
      "list_solutions",
      "get_solution",
      "update_solution",
      "delete_solution",
      "manage_solution_relationships",
    ];

    solutionTools.forEach((toolName) => {
      const tool = tools.tools.find((t) => t.name === toolName);
      expect(tool).toBeDefined();
      expect(tool?.name).toBe(toolName);
    });
  });

  it("should create a new solution", async () => {
    const testData = generateTestSolution();

    const result = await callTool(
      testClient.client,
      "create_solution",
      testData,
    );

    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);

    const response = parseToolResponse<{
      data: {
        id: string;
        title: string;
        description: string;
        prd: string;
        pros: string[];
        cons: string[];
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBeDefined();
    expect(response.data.title).toBe(testData.title);
    expect(response.data.description).toBe(testData.description);
    expect(response.data.prd).toBe(testData.prd);
    expect(response.data.pros).toEqual(testData.pros);
    expect(response.data.cons).toEqual(testData.cons);

    createdSolutionId = response.data.id;
  });

  it("should list solutions", async () => {
    const result = await callTool(testClient.client, "list_solutions");

    expect(result.content).toBeDefined();

    const response = parseToolResponse<{
      data: Array<{ id: string; title: string }>;
    }>(result);

    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);

    // Should include our created solution
    const found = response.data.find((sol) => sol.id === createdSolutionId);
    expect(found).toBeDefined();
  });

  it("should get a specific solution by ID", async () => {
    expect(createdSolutionId).toBeDefined();

    const result = await callTool(testClient.client, "get_solution", {
      solutionId: createdSolutionId,
    });

    const response = parseToolResponse<{
      data: {
        id: string;
        title: string;
        description: string;
        prd: string;
        pros: string[];
        cons: string[];
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdSolutionId);
    expect(response.data.title).toBeDefined();
    expect(response.data.description).toBeDefined();
    expect(response.data.prd).toBeDefined();
    expect(Array.isArray(response.data.pros)).toBe(true);
    expect(Array.isArray(response.data.cons)).toBe(true);
  });

  it("should get solution with relationships", async () => {
    expect(createdSolutionId).toBeDefined();

    const result = await callTool(testClient.client, "get_solution", {
      solutionId: createdSolutionId,
      relationships: ["opportunities", "outcomes", "insights"],
    });

    const response = parseToolResponse<{
      data: {
        id: string;
        opportunities?: unknown[];
        outcomes?: unknown[];
        insights?: unknown[];
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdSolutionId);
  });

  it("should update a solution", async () => {
    expect(createdSolutionId).toBeDefined();

    const updatedTitle = `Updated ${generateTestSolution().title}`;
    const updatedDescription = "This solution has been updated during testing";
    const updatedPrd = "# Updated PRD\n\nThis is an updated PRD for testing.";

    const result = await callTool(testClient.client, "update_solution", {
      solutionId: createdSolutionId,
      title: updatedTitle,
      description: updatedDescription,
      prd: updatedPrd,
      status: "InDevelopment",
    });

    const response = parseToolResponse<{
      data: {
        id: string;
        title: string;
        description: string;
        prd: string;
        status: string;
      };
    }>(result);

    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(createdSolutionId);
    expect(response.data.title).toBe(updatedTitle);
    expect(response.data.description).toBe(updatedDescription);
    expect(response.data.prd).toBe(updatedPrd);
    expect(response.data.status).toBe("InDevelopment");
  });

  it("should update solution status", async () => {
    expect(createdSolutionId).toBeDefined();

    const statuses = ["Planned", "Complete", "Cancelled", "Backlog", "New"];

    for (const status of statuses) {
      const result = await callTool(testClient.client, "update_solution", {
        solutionId: createdSolutionId,
        status,
      });

      const response = parseToolResponse<{
        data: { id: string; status: string };
      }>(result);

      expect(response.data.status).toBe(status);
    }
  });

  it("should delete a solution", async () => {
    // Create a new solution just for deletion test
    const testData = generateTestSolution();
    const createResult = await callTool(
      testClient.client,
      "create_solution",
      testData,
    );

    const createResponse = parseToolResponse<{ data: { id: string } }>(
      createResult,
    );
    const solutionIdToDelete = createResponse.data.id;

    // Delete it
    const deleteResult = await callTool(testClient.client, "delete_solution", {
      solutionId: solutionIdToDelete,
    });

    const deleteResponse = parseToolResponse<{ data: { id: string } }>(
      deleteResult,
    );

    expect(deleteResponse.data).toBeDefined();
    expect(deleteResponse.data.id).toBe(solutionIdToDelete);
  });
});
