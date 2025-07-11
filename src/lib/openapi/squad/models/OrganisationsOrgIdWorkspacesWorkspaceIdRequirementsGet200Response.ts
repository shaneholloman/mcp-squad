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
import type { Requirement } from './Requirement.js';
import {
    RequirementFromJSON,
    RequirementFromJSONTyped,
    RequirementToJSON,
    RequirementToJSONTyped,
} from './Requirement.js';

/**
 * Response containing an array of requirements
 * @export
 * @interface OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200Response
 */
export interface OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200Response {
    /**
     * Array of requirements
     * @type {Array<Requirement>}
     * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200Response
     */
    data: Array<Requirement>;
}

/**
 * Check if a given object implements the OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200Response interface.
 */
export function instanceOfOrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200Response(value: object): value is OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200Response {
    if (!('data' in value) || value['data'] === undefined) return false;
    return true;
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseFromJSON(json: any): OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200Response {
    return OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseFromJSONTyped(json, false);
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'data': ((json['data'] as Array<any>).map(RequirementFromJSON)),
    };
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseToJSON(json: any): OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200Response {
    return OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseToJSONTyped(json, false);
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200ResponseToJSONTyped(value?: OrganisationsOrgIdWorkspacesWorkspaceIdRequirementsGet200Response | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'data': ((value['data'] as Array<any>).map(RequirementToJSON)),
    };
}

