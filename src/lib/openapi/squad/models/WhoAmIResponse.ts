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
import type { WhoAmIResponseData } from './WhoAmIResponseData.js';
import {
    WhoAmIResponseDataFromJSON,
    WhoAmIResponseDataFromJSONTyped,
    WhoAmIResponseDataToJSON,
    WhoAmIResponseDataToJSONTyped,
} from './WhoAmIResponseData.js';

/**
 * User organization and workspace information
 * @export
 * @interface WhoAmIResponse
 */
export interface WhoAmIResponse {
    /**
     * 
     * @type {WhoAmIResponseData}
     * @memberof WhoAmIResponse
     */
    data: WhoAmIResponseData;
}

/**
 * Check if a given object implements the WhoAmIResponse interface.
 */
export function instanceOfWhoAmIResponse(value: object): value is WhoAmIResponse {
    if (!('data' in value) || value['data'] === undefined) return false;
    return true;
}

export function WhoAmIResponseFromJSON(json: any): WhoAmIResponse {
    return WhoAmIResponseFromJSONTyped(json, false);
}

export function WhoAmIResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): WhoAmIResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'data': WhoAmIResponseDataFromJSON(json['data']),
    };
}

export function WhoAmIResponseToJSON(json: any): WhoAmIResponse {
    return WhoAmIResponseToJSONTyped(json, false);
}

export function WhoAmIResponseToJSONTyped(value?: WhoAmIResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'data': WhoAmIResponseDataToJSON(value['data']),
    };
}

