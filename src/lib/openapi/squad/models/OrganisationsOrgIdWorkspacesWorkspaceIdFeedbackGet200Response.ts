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

import type { OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseDataInner } from "./OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseDataInner.js";
import {
  OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseDataInnerFromJSON,
  OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseDataInnerToJSON,
} from "./OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseDataInner.js";

/**
 * Response containing an array of feedback items
 * @export
 * @interface OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200Response
 */
export interface OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200Response {
  /**
   * Array of feedback items
   * @type {Array<OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseDataInner>}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200Response
   */
  data: Array<OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseDataInner>;
}

/**
 * Check if a given object implements the OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200Response interface.
 */
export function instanceOfOrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200Response(
  value: object,
): value is OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200Response {
  if (!("data" in value) || value["data"] === undefined) return false;
  return true;
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseFromJSON(
  json: any,
): OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200Response {
  return OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseFromJSONTyped(
    json,
    false,
  );
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200Response {
  if (json == null) {
    return json;
  }
  return {
    data: (json["data"] as Array<any>).map(
      OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseDataInnerFromJSON,
    ),
  };
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseToJSON(
  json: any,
): OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200Response {
  return OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseToJSONTyped(
    json,
    false,
  );
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseToJSONTyped(
  value?: OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200Response | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    data: (value["data"] as Array<any>).map(
      OrganisationsOrgIdWorkspacesWorkspaceIdFeedbackGet200ResponseDataInnerToJSON,
    ),
  };
}
