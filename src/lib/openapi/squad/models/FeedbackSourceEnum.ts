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


/**
 * The source of the feedback
 * @export
 */
export const FeedbackSourceEnum = {
    Typeform: 'TYPEFORM',
    Slack: 'SLACK',
    Unknown: 'UNKNOWN',
    Manual: 'MANUAL'
} as const;
export type FeedbackSourceEnum = typeof FeedbackSourceEnum[keyof typeof FeedbackSourceEnum];


export function instanceOfFeedbackSourceEnum(value: any): boolean {
    for (const key in FeedbackSourceEnum) {
        if (Object.prototype.hasOwnProperty.call(FeedbackSourceEnum, key)) {
            if (FeedbackSourceEnum[key as keyof typeof FeedbackSourceEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function FeedbackSourceEnumFromJSON(json: any): FeedbackSourceEnum {
    return FeedbackSourceEnumFromJSONTyped(json, false);
}

export function FeedbackSourceEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): FeedbackSourceEnum {
    return json as FeedbackSourceEnum;
}

export function FeedbackSourceEnumToJSON(value?: FeedbackSourceEnum | null): any {
    return value as any;
}

export function FeedbackSourceEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): FeedbackSourceEnum {
    return value as FeedbackSourceEnum;
}

