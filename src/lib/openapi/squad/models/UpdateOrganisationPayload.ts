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
 * Request schema for updating an organisation
 * @export
 * @interface UpdateOrganisationPayload
 */
export interface UpdateOrganisationPayload {
    /**
     * Name of the organisation
     * @type {string}
     * @memberof UpdateOrganisationPayload
     */
    name?: string;
    /**
     * URL to the organisation's homepage
     * @type {string}
     * @memberof UpdateOrganisationPayload
     */
    homepageUrl?: string | null;
    /**
     * URL to the organisation's logo
     * @type {string}
     * @memberof UpdateOrganisationPayload
     */
    logoUrl?: string | null;
    /**
     * Status of the organisation
     * @type {string}
     * @memberof UpdateOrganisationPayload
     */
    status?: UpdateOrganisationPayloadStatusEnum;
}


/**
 * @export
 */
export const UpdateOrganisationPayloadStatusEnum = {
    Active: 'ACTIVE',
    Archived: 'ARCHIVED'
} as const;
export type UpdateOrganisationPayloadStatusEnum = typeof UpdateOrganisationPayloadStatusEnum[keyof typeof UpdateOrganisationPayloadStatusEnum];


/**
 * Check if a given object implements the UpdateOrganisationPayload interface.
 */
export function instanceOfUpdateOrganisationPayload(value: object): value is UpdateOrganisationPayload {
    return true;
}

export function UpdateOrganisationPayloadFromJSON(json: any): UpdateOrganisationPayload {
    return UpdateOrganisationPayloadFromJSONTyped(json, false);
}

export function UpdateOrganisationPayloadFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateOrganisationPayload {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'] == null ? undefined : json['name'],
        'homepageUrl': json['homepageUrl'] == null ? undefined : json['homepageUrl'],
        'logoUrl': json['logoUrl'] == null ? undefined : json['logoUrl'],
        'status': json['status'] == null ? undefined : json['status'],
    };
}

export function UpdateOrganisationPayloadToJSON(json: any): UpdateOrganisationPayload {
    return UpdateOrganisationPayloadToJSONTyped(json, false);
}

export function UpdateOrganisationPayloadToJSONTyped(value?: UpdateOrganisationPayload | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'homepageUrl': value['homepageUrl'],
        'logoUrl': value['logoUrl'],
        'status': value['status'],
    };
}

