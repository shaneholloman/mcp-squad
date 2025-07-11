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
import type { OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseError } from './OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseError.js';
import {
    OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseErrorFromJSON,
    OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseErrorFromJSONTyped,
    OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseErrorToJSON,
    OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseErrorToJSONTyped,
} from './OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseError.js';

/**
 * Unauthorized - Missing or invalid authentication token
 * @export
 * @interface OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401Response
 */
export interface OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401Response {
    /**
     * 
     * @type {OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseError}
     * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401Response
     */
    error: OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseError;
}

/**
 * Check if a given object implements the OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401Response interface.
 */
export function instanceOfOrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401Response(value: object): value is OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401Response {
    if (!('error' in value) || value['error'] === undefined) return false;
    return true;
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseFromJSON(json: any): OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401Response {
    return OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseFromJSONTyped(json, false);
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401Response {
    if (json == null) {
        return json;
    }
    return {
        
        'error': OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseErrorFromJSON(json['error']),
    };
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseToJSON(json: any): OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401Response {
    return OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseToJSONTyped(json, false);
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseToJSONTyped(value?: OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401Response | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'error': OrganisationsOrgIdWorkspacesWorkspaceIdOutcomesGet401ResponseErrorToJSON(value['error']),
    };
}

