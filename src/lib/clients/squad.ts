import * as SquadApi from "../openapi/squad/index.js";
import { withAuth } from "./middleware/with-auth.js";

const getEnv = (): "production" | "staging" | "development" => {
  if (!process.env.SQUAD_ENV) {
    return "production";
  }
  if (process.env.SQUAD_ENV === "dev") {
    return "development";
  }
  if (process.env.SQUAD_ENV === "staging") {
    return "staging";
  }
  return "production";
};

const getBasePath = (): string => {
  const env = getEnv();
  if (env === "production") {
    return "https://api.meetsquad.ai";
  }
  if (env === "staging") {
    return "https://uat.api.meetsquad.ai";
  }
  return "https://dev.api.meetsquad.ai";
};

// Define a namespace for our global variable to avoid TypeScript errors
declare global {
  var squadApiKeyInstance: SquadApi.SquadApi | undefined;
}

// Function overload signatures
export function squadClient(options: {
  apiKey?: string;
  jwt?: string;
}): SquadApi.SquadApi;
export function squadClient(jwt?: string): SquadApi.SquadApi;

// Implementation
export function squadClient(
  optionsOrJwt?: { apiKey?: string; jwt?: string } | string,
): SquadApi.SquadApi {
  // Handle the case where a string (JWT) is passed directly
  let options: { apiKey?: string; jwt?: string };
  if (typeof optionsOrJwt === "string") {
    options = { jwt: optionsOrJwt };
  } else if (!optionsOrJwt) {
    // No parameters - use API key from command-line or environment
    options = { apiKey: global.SQUAD_API_KEY_OVERRIDE || process.env.SQUAD_API_KEY };
  } else {
    options = optionsOrJwt;
  }

  // Validate that exactly one auth method is provided
  if (!options.apiKey && !options.jwt) {
    console.error(
      "[squadClient] Authentication error: Neither API key nor JWT provided",
    );
    throw new Error("Either apiKey or jwt must be provided");
  }
  if (options.apiKey && options.jwt) {
    console.error(
      "[squadClient] Authentication error: Both API key and JWT provided",
    );
    throw new Error("Only one of apiKey or jwt should be provided");
  }

  const basePath = getBasePath();

  // Create a new instance every time with JWT, don't cache
  if (options.jwt) {
    const client = new SquadApi.SquadApi(
      new SquadApi.Configuration({
        basePath,
        middleware: [withAuth(options.jwt)],
      }),
    );

    return client;
  }

  // For API key, we can still use caching
  if (!global.squadApiKeyInstance) {
    global.squadApiKeyInstance = new SquadApi.SquadApi(
      new SquadApi.Configuration({
        basePath,
        middleware: [withAuth(undefined)], // API key from env
      }),
    );
  } else {
  }

  return global.squadApiKeyInstance;
}
