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

      console.log("using auth method", jwt ? "Bearer" : "API Key");

      const authMethod = jwt ? `Bearer ${jwt}` : getAPIKey();

      const authHeaders = {
        authorization: authMethod,
      };

      ctx.init.headers = {
        ...ctx.init.headers,
        ...authHeaders,
      };

      console.log("headers", ctx.init.headers);
    },
  };
}
