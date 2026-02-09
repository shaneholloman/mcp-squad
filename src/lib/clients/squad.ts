import * as SquadApi from "../openapi/squad/index.js";
import { withAuth } from "./middleware/with-auth.js";
import type { UserContext } from "../../helpers/getUser.js";
import { getSquadApiUrl } from "../../helpers/config.js";

/**
 * Create a Squad API client with OAuth token authentication
 * @param auth - UserContext or object with token
 */
export function squadClient(
  auth: UserContext | { token: string }
): SquadApi.SquadApi {
  const { token } = auth;

  if (!token) {
    throw new Error("Token is required");
  }

  const basePath = getSquadApiUrl();

  return new SquadApi.SquadApi(
    new SquadApi.Configuration({
      basePath,
      middleware: [withAuth(token)],
    }),
  );
}
