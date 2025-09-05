import {
  FetchParams,
  Middleware,
  RequestContext,
} from "../../openapi/squad/index.js";

export const getAPIKey = () => {
  // Check command-line argument first
  if (global.SQUAD_API_KEY_OVERRIDE) {
    return global.SQUAD_API_KEY_OVERRIDE;
  }
  
  // Fall back to environment variable
  if (!process.env.SQUAD_API_KEY) {
    throw new Error("SQUAD_API_KEY is not set. Please provide it via --api-key argument or SQUAD_API_KEY environment variable");
  }
  return process.env.SQUAD_API_KEY;
};

export function withAuth(jwt?: string): Middleware {
  return {
    pre: async (ctx: RequestContext): Promise<void | FetchParams> => {
      if (!ctx.init.headers) ctx.init.headers = {};

      const authMethod = jwt ? `Bearer ${jwt}` : getAPIKey();

      const authHeaders = {
        authorization: authMethod,
      };

      ctx.init.headers = {
        ...ctx.init.headers,
        ...authHeaders,
      };
    },
  };
}
