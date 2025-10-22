import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables
dotenv.config({ path: path.join(__dirname, "../.env.test") });

// Validate required environment variables
if (!process.env.SQUAD_API_KEY) {
  throw new Error(
    "SQUAD_API_KEY is required for integration tests. Please create a .env.test file based on .env.test.example",
  );
}

export const getApiKey = (): string => {
  const apiKey = process.env.SQUAD_API_KEY;
  if (!apiKey) {
    throw new Error("SQUAD_API_KEY not found in environment");
  }
  return apiKey;
};
