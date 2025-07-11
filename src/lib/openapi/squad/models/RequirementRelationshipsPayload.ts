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
/**
 * Request body for managing requirement relationships
 * @export
 * @interface RequirementRelationshipsPayload
 */
export interface RequirementRelationshipsPayload {
    /**
     * Array of solution IDs to associate with the requirement
     * @type {Array<string>}
     * @memberof RequirementRelationshipsPayload
     */
    solutionIds?: Array<string>;
}

/**
 * Check if a given object implements the RequirementRelationshipsPayload interface.
 */
export function instanceOfRequirementRelationshipsPayload(value: object): value is RequirementRelationshipsPayload {
    return true;
}

export function RequirementRelationshipsPayloadFromJSON(json: any): RequirementRelationshipsPayload {
    return RequirementRelationshipsPayloadFromJSONTyped(json, false);
}

export function RequirementRelationshipsPayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): RequirementRelationshipsPayload {
    if (json == null) {
        return json;
    }
    return {
        
        'solutionIds': json['solutionIds'] == null ? undefined : json['solutionIds'],
    };
}

export function RequirementRelationshipsPayloadToJSON(json: any): RequirementRelationshipsPayload {
    return RequirementRelationshipsPayloadToJSONTyped(json, false);
}

export function RequirementRelationshipsPayloadToJSONTyped(value?: RequirementRelationshipsPayload | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'solutionIds': value['solutionIds'],
    };
}

