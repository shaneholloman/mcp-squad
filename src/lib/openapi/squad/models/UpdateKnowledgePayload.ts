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
 * Request schema for updating knowledge
 * @export
 * @interface UpdateKnowledgePayload
 */
export interface UpdateKnowledgePayload {
    /**
     * Knowledge title
     * @type {string}
     * @memberof UpdateKnowledgePayload
     */
    title?: string;
    /**
     * Knowledge description - a short summary of the knowledge
     * @type {string}
     * @memberof UpdateKnowledgePayload
     */
    description?: string;
    /**
     * The content of the knowledge, only available for text sources, optional
     * @type {string}
     * @memberof UpdateKnowledgePayload
     */
    content?: string;
}

/**
 * Check if a given object implements the UpdateKnowledgePayload interface.
 */
export function instanceOfUpdateKnowledgePayload(value: object): value is UpdateKnowledgePayload {
    return true;
}

export function UpdateKnowledgePayloadFromJSON(json: any): UpdateKnowledgePayload {
    return UpdateKnowledgePayloadFromJSONTyped(json, false);
}

export function UpdateKnowledgePayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateKnowledgePayload {
    if (json == null) {
        return json;
    }
    return {
        
        'title': json['title'] == null ? undefined : json['title'],
        'description': json['description'] == null ? undefined : json['description'],
        'content': json['content'] == null ? undefined : json['content'],
    };
}

export function UpdateKnowledgePayloadToJSON(json: any): UpdateKnowledgePayload {
    return UpdateKnowledgePayloadToJSONTyped(json, false);
}

export function UpdateKnowledgePayloadToJSONTyped(value?: UpdateKnowledgePayload | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'title': value['title'],
        'description': value['description'],
        'content': value['content'],
    };
}

