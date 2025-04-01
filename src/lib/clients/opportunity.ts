import * as SquadApi from "../openapi/squad/index.js";


let instance: SquadApi.OpportunitiesApi | null = null;
export function opportunityClient(): SquadApi.OpportunitiesApi {
  if (!instance) {
    instance = new SquadApi.OpportunitiesApi(
      new SquadApi.Configuration({
        basePath: "https://dev.api.meetsquad.ai",
        middleware: [],
      })
    );
  }
  return instance;
}
