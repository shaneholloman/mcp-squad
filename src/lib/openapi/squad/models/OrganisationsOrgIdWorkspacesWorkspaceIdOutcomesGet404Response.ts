/* tslint:disable */
/* eslint-disable */
/**
 * Squad API
 * API for managing Squad resources
 *
 * The version of the OpenAPI document: 0.14.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseError } from "./OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseError.js";
import {
  OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseErrorFromJSON,
  OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseErrorToJSON,
} from "./OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseError.js";

/**
 * Not Found - The requested resource does not exist
 * @export
 * @interface OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404Response
 */
export interface OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404Response {
  /**
   *
   * @type {OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseError}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404Response
   */
  error: OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseError;
}

/**
 * Check if a given object implements the OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404Response interface.
 */
export function instanceOfOrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404Response(
  value: object,
): value is OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404Response {
  if (!("error" in value) || value["error"] === undefined) return false;
  return true;
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseFromJSON(
  json: any,
): OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404Response {
  return OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseFromJSONTyped(
    json,
    false,
  );
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404Response {
  if (json == null) {
    return json;
  }
  return {
    error:
      OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseErrorFromJSON(
        json["error"],
      ),
  };
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseToJSON(
  json: any,
): OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404Response {
  return OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseToJSONTyped(
    json,
    false,
  );
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseToJSONTyped(
  value?: OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404Response | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    error:
      OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet404ResponseErrorToJSON(
        value["error"],
      ),
  };
}
