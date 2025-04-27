import {
  FetchParams,
  Middleware,
  RequestContext,
} from "../../openapi/squad/index.js";

export const getAPIKey = () => {
  if (!process.env.SQUAD_API_KEY) {
    throw new Error("SQUAD_API_KEY is not set");
  }
  return process.env.SQUAD_API_KEY;
};

export function withAuth(jwt?: string): Middleware {
  return {
    pre: async (ctx: RequestContext): Promise<void | FetchParams> => {
      if (!ctx.init.headers) ctx.init.headers = {};

      const authMethod = jwt ? `Bearer ${jwt}` : getAPIKey();

      (ctx.init.headers as Record<string, string>)["Authorization"] =
        authMethod;
    },
  };
}
