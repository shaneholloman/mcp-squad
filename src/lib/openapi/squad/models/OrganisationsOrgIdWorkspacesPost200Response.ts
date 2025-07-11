/* tslint:disable */
/* eslint-disable */
/**
 * Squad API
 * API for managing Squad resources
 *
 * The version of the OpenAPI document: 1.4.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime.js';
import type { Workspace } from './Workspace.js';
import {
    WorkspaceFromJSON,
    WorkspaceFromJSONTyped,
    WorkspaceToJSON,
    WorkspaceToJSONTyped,
} from './Workspace.js';

/**
 * Response containing a single workspace
 * @export
 * @interface OrganisationsOrgIdWorkspacesPost200Response
 */
export interface OrganisationsOrgIdWorkspacesPost200Response {
    /**
     * Workspace data
     * @type {Workspace}
     * @memberof OrganisationsOrgIdWorkspacesPost200Response
     */
    data: Workspace;
}

/**
 * Check if a given object implements the OrganisationsOrgIdWorkspacesPost200Response interface.
 */
export function instanceOfOrganisationsOrgIdWorkspacesPost200Response(value: object): value is OrganisationsOrgIdWorkspacesPost200Response {
    if (!('data' in value) || value['data'] === undefined) return false;
    return true;
}

export function OrganisationsOrgIdWorkspacesPost200ResponseFromJSON(json: any): OrganisationsOrgIdWorkspacesPost200Response {
    return OrganisationsOrgIdWorkspacesPost200ResponseFromJSONTyped(json, false);
}

export function OrganisationsOrgIdWorkspacesPost200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): OrganisationsOrgIdWorkspacesPost200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'data': WorkspaceFromJSON(json['data']),
    };
}

export function OrganisationsOrgIdWorkspacesPost200ResponseToJSON(json: any): OrganisationsOrgIdWorkspacesPost200Response {
    return OrganisationsOrgIdWorkspacesPost200ResponseToJSONTyped(json, false);
}

export function OrganisationsOrgIdWorkspacesPost200ResponseToJSONTyped(value?: OrganisationsOrgIdWorkspacesPost200Response | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'data': WorkspaceToJSON(value['data']),
    };
}

