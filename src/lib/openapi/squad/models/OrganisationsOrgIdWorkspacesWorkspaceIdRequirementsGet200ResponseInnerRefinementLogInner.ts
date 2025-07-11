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

/**
 *
 * @export
 * @interface OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInner
 */
export interface OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInner {
  /**
   *
   * @type {string}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInner
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInner
   */
  role: OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInnerRoleEnum;
  /**
   *
   * @type {string}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInner
   */
  content: string;
}

/**
 * @export
 */
export const OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInnerRoleEnum =
  {
    User: "user",
    Assistant: "assistant",
  } as const;
export type OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInnerRoleEnum =
  (typeof OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInnerRoleEnum)[keyof typeof OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInnerRoleEnum];

/**
 * Check if a given object implements the OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInner interface.
 */
export function instanceOfOrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInner(
  value: object,
): value is OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInner {
  if (!("id" in value) || value["id"] === undefined) return false;
  if (!("role" in value) || value["role"] === undefined) return false;
  if (!("content" in value) || value["content"] === undefined) return false;
  return true;
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInnerFromJSON(
  json: any,
): OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInner {
  return OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInnerFromJSONTyped(
    json,
    false,
  );
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInnerFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInner {
  if (json == null) {
    return json;
  }
  return {
    id: json["id"],
    role: json["role"],
    content: json["content"],
  };
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInnerToJSON(
  json: any,
): OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInner {
  return OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInnerToJSONTyped(
    json,
    false,
  );
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInnerToJSONTyped(
  value?: OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseInnerRefinementLogInner | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    id: value["id"],
    role: value["role"],
    content: value["content"],
  };
}
