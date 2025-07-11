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
import type { SimilaritySearchResponse } from './SimilaritySearchResponse.js';
import {
    SimilaritySearchResponseFromJSON,
    SimilaritySearchResponseFromJSONTyped,
    SimilaritySearchResponseToJSON,
    SimilaritySearchResponseToJSONTyped,
} from './SimilaritySearchResponse.js';

/**
 * Response containing a similarity search result
 * @export
 * @interface OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200Response
 */
export interface OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200Response {
    /**
     * 
     * @type {SimilaritySearchResponse}
     * @memberof OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200Response
     */
    data: SimilaritySearchResponse;
}

/**
 * Check if a given object implements the OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200Response interface.
 */
export function instanceOfOrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200Response(value: object): value is OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200Response {
    if (!('data' in value) || value['data'] === undefined) return false;
    return true;
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200ResponseFromJSON(json: any): OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200Response {
    return OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200ResponseFromJSONTyped(json, false);
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'data': SimilaritySearchResponseFromJSON(json['data']),
    };
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200ResponseToJSON(json: any): OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200Response {
    return OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200ResponseToJSONTyped(json, false);
}

export function OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200ResponseToJSONTyped(value?: OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost200Response | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'data': SimilaritySearchResponseToJSON(value['data']),
    };
}

