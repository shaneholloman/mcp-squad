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
 * Knowledge entity schema
 * @export
 * @interface Knowledge
 */
export interface Knowledge {
    /**
     * Knowledge ID
     * @type {string}
     * @memberof Knowledge
     */
    id: string;
    /**
     * Knowledge state
     * @type {string}
     * @memberof Knowledge
     */
    state: KnowledgeStateEnum;
    /**
     * Knowledge title
     * @type {string}
     * @memberof Knowledge
     */
    title: string;
    /**
     * Knowledge description - a short summary of the knowledge
     * @type {string}
     * @memberof Knowledge
     */
    description: string;
    /**
     * Knowledge creation timestamp
     * @type {string}
     * @memberof Knowledge
     */
    createdAt: string;
    /**
     * Knowledge update timestamp
     * @type {string}
     * @memberof Knowledge
     */
    updatedAt: string;
    /**
     * Type of knowledge
     * @type {string}
     * @memberof Knowledge
     */
    source: KnowledgeSourceEnum;
    /**
     * URL of the PDF file of the knowledge (mutually exclusive with url)
     * @type {string}
     * @memberof Knowledge
     */
    pdfFileUrl?: string;
    /**
     * URL of the TXT file of the knowledge (mutually exclusive with url)
     * @type {string}
     * @memberof Knowledge
     */
    txtFileUrl?: string;
    /**
     * URL of the knowledge source (mutually exclusive with filePath)
     * @type {string}
     * @memberof Knowledge
     */
    url?: string;
}


/**
 * @export
 */
export const KnowledgeStateEnum = {
    Initial: 'initial',
    Processing: 'processing',
    Completed: 'completed',
    Error: 'error'
} as const;
export type KnowledgeStateEnum = typeof KnowledgeStateEnum[keyof typeof KnowledgeStateEnum];

/**
 * @export
 */
export const KnowledgeSourceEnum = {
    Text: 'text',
    Url: 'url',
    Pdf: 'pdf'
} as const;
export type KnowledgeSourceEnum = typeof KnowledgeSourceEnum[keyof typeof KnowledgeSourceEnum];


/**
 * Check if a given object implements the Knowledge interface.
 */
export function instanceOfKnowledge(value: object): value is Knowledge {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('state' in value) || value['state'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('description' in value) || value['description'] === undefined) return false;
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    if (!('updatedAt' in value) || value['updatedAt'] === undefined) return false;
    if (!('source' in value) || value['source'] === undefined) return false;
    return true;
}

export function KnowledgeFromJSON(json: any): Knowledge {
    return KnowledgeFromJSONTyped(json, false);
}

export function KnowledgeFromJSONTyped(json: any, ignoreDiscriminator: boolean): Knowledge {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'state': json['state'],
        'title': json['title'],
        'description': json['description'],
        'createdAt': json['createdAt'],
        'updatedAt': json['updatedAt'],
        'source': json['source'],
        'pdfFileUrl': json['pdfFileUrl'] == null ? undefined : json['pdfFileUrl'],
        'txtFileUrl': json['txtFileUrl'] == null ? undefined : json['txtFileUrl'],
        'url': json['url'] == null ? undefined : json['url'],
    };
}

export function KnowledgeToJSON(json: any): Knowledge {
    return KnowledgeToJSONTyped(json, false);
}

export function KnowledgeToJSONTyped(value?: Knowledge | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'state': value['state'],
        'title': value['title'],
        'description': value['description'],
        'createdAt': value['createdAt'],
        'updatedAt': value['updatedAt'],
        'source': value['source'],
        'pdfFileUrl': value['pdfFileUrl'],
        'txtFileUrl': value['txtFileUrl'],
        'url': value['url'],
    };
}

