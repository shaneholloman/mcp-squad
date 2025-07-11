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

import type { OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseDataInnerRefinementLogInner } from "./OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseDataInnerRefinementLogInner.js";
import {
  OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseDataInnerRefinementLogInnerFromJSON,
  OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseDataInnerRefinementLogInnerToJSON,
} from "./OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseDataInnerRefinementLogInner.js";

/**
 * Request schema for updating a solution
 * @export
 * @interface OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest
 */
export interface OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest {
  /**
   *
   * @type {string}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest
   */
  title?: string;
  /**
   *
   * @type {string}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest
   */
  description?: string;
  /**
   *
   * @type {string}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest
   */
  status?: OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestStatusEnum;
  /**
   *
   * @type {Array<string>}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest
   */
  pros?: Array<string>;
  /**
   *
   * @type {Array<string>}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest
   */
  cons?: Array<string>;
  /**
   *
   * @type {boolean}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest
   */
  hideContent?: boolean;
  /**
   *
   * @type {string}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest
   */
  createdBy?: OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestCreatedByEnum;
  /**
   *
   * @type {string}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest
   */
  ownerId?: string;
  /**
   *
   * @type {string}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest
   */
  systemPrompt?: string | null;
  /**
   *
   * @type {string}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest
   */
  aiProcessingState?: OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestAiProcessingStateEnum;
  /**
   *
   * @type {Array<OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseDataInnerRefinementLogInner>}
   * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest
   */
  refinementLog?: Array<OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseDataInnerRefinementLogInner>;
}

/**
 * @export
 */
export const OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestStatusEnum =
  {
    New: "New",
    Solved: "Solved",
    Planned: "Planned",
    InProgress: "InProgress",
  } as const;
export type OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestStatusEnum =
  (typeof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestStatusEnum)[keyof typeof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestStatusEnum];

/**
 * @export
 */
export const OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestCreatedByEnum =
  {
    User: "user",
    Generated: "generated",
  } as const;
export type OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestCreatedByEnum =
  (typeof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestCreatedByEnum)[keyof typeof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestCreatedByEnum];

/**
 * @export
 */
export const OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestAiProcessingStateEnum =
  {
    Initial: "INITIAL",
    Processing: "PROCESSING",
    Finished: "FINISHED",
    Error: "ERROR",
  } as const;
export type OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestAiProcessingStateEnum =
  (typeof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestAiProcessingStateEnum)[keyof typeof OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestAiProcessingStateEnum];

/**
 * Check if a given object implements the OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest interface.
 */
export function instanceOfOrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest(
  value: object,
): value is OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest {
  return true;
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestFromJSON(
  json: any,
): OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest {
  return OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestFromJSONTyped(
    json,
    false,
  );
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest {
  if (json == null) {
    return json;
  }
  return {
    title: json["title"] == null ? undefined : json["title"],
    description: json["description"] == null ? undefined : json["description"],
    status: json["status"] == null ? undefined : json["status"],
    pros: json["pros"] == null ? undefined : json["pros"],
    cons: json["cons"] == null ? undefined : json["cons"],
    hideContent: json["hideContent"] == null ? undefined : json["hideContent"],
    createdBy: json["createdBy"] == null ? undefined : json["createdBy"],
    ownerId: json["ownerId"] == null ? undefined : json["ownerId"],
    systemPrompt:
      json["systemPrompt"] == null ? undefined : json["systemPrompt"],
    aiProcessingState:
      json["aiProcessingState"] == null ? undefined : json["aiProcessingState"],
    refinementLog:
      json["refinementLog"] == null
        ? undefined
        : (json["refinementLog"] as Array<any>).map(
            OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseDataInnerRefinementLogInnerFromJSON,
          ),
  };
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestToJSON(
  json: any,
): OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest {
  return OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestToJSONTyped(
    json,
    false,
  );
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequestToJSONTyped(
  value?: OrganisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPutRequest | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    title: value["title"],
    description: value["description"],
    status: value["status"],
    pros: value["pros"],
    cons: value["cons"],
    hideContent: value["hideContent"],
    createdBy: value["createdBy"],
    ownerId: value["ownerId"],
    systemPrompt: value["systemPrompt"],
    aiProcessingState: value["aiProcessingState"],
    refinementLog:
      value["refinementLog"] == null
        ? undefined
        : (value["refinementLog"] as Array<any>).map(
            OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseDataInnerRefinementLogInnerToJSON,
          ),
  };
}
