import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface TestMCPClient {
  client: Client;
  cleanup: () => Promise<void>;
}

/**
 * Creates an MCP client that connects to the server for integration testing
 */
export async function createTestMCPClient(
  apiKey: string,
): Promise<TestMCPClient> {
  const serverPath = path.join(__dirname, "../../dist/index.js");

  const serverProcess = spawn("node", [serverPath, "--api-key", apiKey], {
    stdio: ["pipe", "pipe", "pipe"],
    env: {
      ...process.env,
      SQUAD_API_KEY: apiKey,
    },
  });

  // Log server errors for debugging
  serverProcess.stderr.on("data", (data) => {
    const message = data.toString();
    if (!message.includes("[squad-mcp:server:info]")) {
      console.error("Server error:", message);
    }
  });

  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath, "--api-key", apiKey],
    env: {
      ...process.env,
      SQUAD_API_KEY: apiKey,
    },
  });

  const client = new Client(
    {
      name: "squad-mcp-test-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    },
  );

  await client.connect(transport);

  const cleanup = async () => {
    try {
      await client.close();
      serverProcess.kill();
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  };

  return { client, cleanup };
}

/**
 * Calls a tool and returns the result
 */
export async function callTool(
  client: Client,
  name: string,
  args?: Record<string, unknown>,
) {
  const result = await client.callTool({
    name,
    arguments: args || {},
  });

  return result;
}

/**
 * Parse JSON response from MCP tool
 */
export function parseToolResponse<T = unknown>(result: {
  content: Array<{ type: string; text: string }>;
}): T {
  const textContent = result.content.find((c) => c.type === "text");
  if (!textContent) {
    console.error("No text content in response. Full result:", JSON.stringify(result, null, 2));
    throw new Error("No text content in response");
  }

  try {
    const parsed = JSON.parse(textContent.text) as T;
    console.log("Parsed response:", JSON.stringify(parsed, null, 2));
    return parsed;
  } catch (error) {
    console.error("Failed to parse response:", textContent.text);
    throw error;
  }
}
