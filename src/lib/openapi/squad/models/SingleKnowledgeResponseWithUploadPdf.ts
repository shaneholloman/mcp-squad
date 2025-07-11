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
 * Response containing a single knowledge
 * @export
 * @interface SingleKnowledgeResponseWithUploadPdf
 */
export interface SingleKnowledgeResponseWithUploadPdf {
    /**
     * The single use secure S3 upload url.
     * @type {string}
     * @memberof SingleKnowledgeResponseWithUploadPdf
     */
    uploadUrl: string;
    /**
     * Knowledge ID
     * @type {string}
     * @memberof SingleKnowledgeResponseWithUploadPdf
     */
    id: string;
    /**
     * Knowledge state
     * @type {string}
     * @memberof SingleKnowledgeResponseWithUploadPdf
     */
    state: SingleKnowledgeResponseWithUploadPdfStateEnum;
    /**
     * Knowledge title
     * @type {string}
     * @memberof SingleKnowledgeResponseWithUploadPdf
     */
    title: string;
    /**
     * Knowledge description - a short summary of the knowledge
     * @type {string}
     * @memberof SingleKnowledgeResponseWithUploadPdf
     */
    description: string;
    /**
     * Knowledge creation timestamp
     * @type {string}
     * @memberof SingleKnowledgeResponseWithUploadPdf
     */
    createdAt: string;
    /**
     * Knowledge update timestamp
     * @type {string}
     * @memberof SingleKnowledgeResponseWithUploadPdf
     */
    updatedAt: string;
    /**
     * Type of knowledge
     * @type {string}
     * @memberof SingleKnowledgeResponseWithUploadPdf
     */
    source: SingleKnowledgeResponseWithUploadPdfSourceEnum;
    /**
     * URL of the PDF file of the knowledge (mutually exclusive with url)
     * @type {string}
     * @memberof SingleKnowledgeResponseWithUploadPdf
     */
    pdfFileUrl?: string;
    /**
     * URL of the TXT file of the knowledge (mutually exclusive with url)
     * @type {string}
     * @memberof SingleKnowledgeResponseWithUploadPdf
     */
    txtFileUrl?: string;
    /**
     * URL of the knowledge source (mutually exclusive with filePath)
     * @type {string}
     * @memberof SingleKnowledgeResponseWithUploadPdf
     */
    url?: string;
}


/**
 * @export
 */
export const SingleKnowledgeResponseWithUploadPdfStateEnum = {
    Initial: 'initial',
    Processing: 'processing',
    Completed: 'completed',
    Error: 'error'
} as const;
export type SingleKnowledgeResponseWithUploadPdfStateEnum = typeof SingleKnowledgeResponseWithUploadPdfStateEnum[keyof typeof SingleKnowledgeResponseWithUploadPdfStateEnum];

/**
 * @export
 */
export const SingleKnowledgeResponseWithUploadPdfSourceEnum = {
    Text: 'text',
    Url: 'url',
    Pdf: 'pdf'
} as const;
export type SingleKnowledgeResponseWithUploadPdfSourceEnum = typeof SingleKnowledgeResponseWithUploadPdfSourceEnum[keyof typeof SingleKnowledgeResponseWithUploadPdfSourceEnum];


/**
 * Check if a given object implements the SingleKnowledgeResponseWithUploadPdf interface.
 */
export function instanceOfSingleKnowledgeResponseWithUploadPdf(value: object): value is SingleKnowledgeResponseWithUploadPdf {
    if (!('uploadUrl' in value) || value['uploadUrl'] === undefined) return false;
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('state' in value) || value['state'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('description' in value) || value['description'] === undefined) return false;
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    if (!('updatedAt' in value) || value['updatedAt'] === undefined) return false;
    if (!('source' in value) || value['source'] === undefined) return false;
    return true;
}

export function SingleKnowledgeResponseWithUploadPdfFromJSON(json: any): SingleKnowledgeResponseWithUploadPdf {
    return SingleKnowledgeResponseWithUploadPdfFromJSONTyped(json, false);
}

export function SingleKnowledgeResponseWithUploadPdfFromJSONTyped(json: any, ignoreDiscriminator: boolean): SingleKnowledgeResponseWithUploadPdf {
    if (json == null) {
        return json;
    }
    return {
        
        'uploadUrl': json['uploadUrl'],
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

export function SingleKnowledgeResponseWithUploadPdfToJSON(json: any): SingleKnowledgeResponseWithUploadPdf {
    return SingleKnowledgeResponseWithUploadPdfToJSONTyped(json, false);
}

export function SingleKnowledgeResponseWithUploadPdfToJSONTyped(value?: SingleKnowledgeResponseWithUploadPdf | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'uploadUrl': value['uploadUrl'],
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

