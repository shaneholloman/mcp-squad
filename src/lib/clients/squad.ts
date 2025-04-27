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

let instance: SquadApi.DefaultApi | null = null;

export function squadClient(jwt?: string): SquadApi.DefaultApi {
  const basePath = getBasePath();
  if (!instance) {
    instance = new SquadApi.DefaultApi(
      new SquadApi.Configuration({
        basePath,
        middleware: [withAuth(jwt)],
      }),
    );
  }
  return instance;
}
