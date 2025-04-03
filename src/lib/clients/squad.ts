import * as SquadApi from "../openapi/squad/index.js";
import { setAuthHeaderMiddleware } from "./middleware/with-api-key.js";


let instance: SquadApi.DefaultApi | null = null;
export function squadClient(): SquadApi.DefaultApi {
  if (!instance) {
    instance = new SquadApi.DefaultApi(
      new SquadApi.Configuration({
        basePath: "https://dev.api.meetsquad.ai",
        middleware: [
          setAuthHeaderMiddleware(),
        ],
      })
    );
  }
  return instance;
}
