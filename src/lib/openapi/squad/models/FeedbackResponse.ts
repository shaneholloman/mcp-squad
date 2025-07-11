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
import type { FeedbackSourceEnum } from './FeedbackSourceEnum.js';
import {
    FeedbackSourceEnumFromJSON,
    FeedbackSourceEnumFromJSONTyped,
    FeedbackSourceEnumToJSON,
    FeedbackSourceEnumToJSONTyped,
} from './FeedbackSourceEnum.js';

/**
 * Response data for processed feedback
 * @export
 * @interface FeedbackResponse
 */
export interface FeedbackResponse {
    /**
     * The feedback content
     * @type {string}
     * @memberof FeedbackResponse
     */
    feedback: string;
    /**
     * 
     * @type {FeedbackSourceEnum}
     * @memberof FeedbackResponse
     */
    source: FeedbackSourceEnum;
    /**
     * ID of the workspace
     * @type {string}
     * @memberof FeedbackResponse
     */
    workspaceId: string;
    /**
     * ID of the organization
     * @type {string}
     * @memberof FeedbackResponse
     */
    organisationId: string;
}



/**
 * Check if a given object implements the FeedbackResponse interface.
 */
export function instanceOfFeedbackResponse(value: object): value is FeedbackResponse {
    if (!('feedback' in value) || value['feedback'] === undefined) return false;
    if (!('source' in value) || value['source'] === undefined) return false;
    if (!('workspaceId' in value) || value['workspaceId'] === undefined) return false;
    if (!('organisationId' in value) || value['organisationId'] === undefined) return false;
    return true;
}

export function FeedbackResponseFromJSON(json: any): FeedbackResponse {
    return FeedbackResponseFromJSONTyped(json, false);
}

export function FeedbackResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): FeedbackResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'feedback': json['feedback'],
        'source': FeedbackSourceEnumFromJSON(json['source']),
        'workspaceId': json['workspaceId'],
        'organisationId': json['organisationId'],
    };
}

export function FeedbackResponseToJSON(json: any): FeedbackResponse {
    return FeedbackResponseToJSONTyped(json, false);
}

export function FeedbackResponseToJSONTyped(value?: FeedbackResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'feedback': value['feedback'],
        'source': FeedbackSourceEnumToJSON(value['source']),
        'workspaceId': value['workspaceId'],
        'organisationId': value['organisationId'],
    };
}

