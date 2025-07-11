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
import type { Feedback } from './Feedback.js';
import {
    FeedbackFromJSON,
    FeedbackFromJSONTyped,
    FeedbackToJSON,
    FeedbackToJSONTyped,
} from './Feedback.js';
import type { Outcome } from './Outcome.js';
import {
    OutcomeFromJSON,
    OutcomeFromJSONTyped,
    OutcomeToJSON,
    OutcomeToJSONTyped,
} from './Outcome.js';
import type { Topic } from './Topic.js';
import {
    TopicFromJSON,
    TopicFromJSONTyped,
    TopicToJSON,
    TopicToJSONTyped,
} from './Topic.js';
import type { Solution } from './Solution.js';
import {
    SolutionFromJSON,
    SolutionFromJSONTyped,
    SolutionToJSON,
    SolutionToJSONTyped,
} from './Solution.js';

/**
 * Opportunity data
 * @export
 * @interface OpportunityResponseData
 */
export interface OpportunityResponseData {
    /**
     * Unique identifier for the opportunity
     * @type {string}
     * @memberof OpportunityResponseData
     */
    id: string;
    /**
     * Whether the opportunity has been read
     * @type {boolean}
     * @memberof OpportunityResponseData
     */
    read: boolean;
    /**
     * Current status of the opportunity
     * @type {string}
     * @memberof OpportunityResponseData
     */
    status: OpportunityResponseDataStatusEnum;
    /**
     * Title of the opportunity
     * @type {string}
     * @memberof OpportunityResponseData
     */
    title: string;
    /**
     * Description of the opportunity
     * @type {string}
     * @memberof OpportunityResponseData
     */
    description: string;
    /**
     * Current state of solution generation
     * @type {string}
     * @memberof OpportunityResponseData
     */
    solutionsGeneratingState: OpportunityResponseDataSolutionsGeneratingStateEnum;
    /**
     * How the opportunity was created
     * @type {string}
     * @memberof OpportunityResponseData
     */
    createdBy: OpportunityResponseDataCreatedByEnum;
    /**
     * Whether the opportunity content should be hidden
     * @type {boolean}
     * @memberof OpportunityResponseData
     */
    hideContent: boolean;
    /**
     * ID of the opportunity owner
     * @type {string}
     * @memberof OpportunityResponseData
     */
    ownerId?: string;
    /**
     * Creation timestamp
     * @type {string}
     * @memberof OpportunityResponseData
     */
    createdAt: string;
    /**
     * Last update timestamp
     * @type {string}
     * @memberof OpportunityResponseData
     */
    updatedAt: string;
    /**
     * Whether the opportunity has unseen feedback
     * @type {boolean}
     * @memberof OpportunityResponseData
     */
    hasUnseenFeedback: boolean;
    /**
     * 
     * @type {Array<Solution>}
     * @memberof OpportunityResponseData
     */
    solutions: Array<Solution>;
    /**
     * 
     * @type {Array<Requirement>}
     * @memberof OpportunityResponseData
     */
    requirements: Array<Requirement>;
    /**
     * 
     * @type {Array<Feedback>}
     * @memberof OpportunityResponseData
     */
    feedback: Array<Feedback>;
    /**
     * 
     * @type {Array<Outcome>}
     * @memberof OpportunityResponseData
     */
    outcomes: Array<Outcome>;
    /**
     * 
     * @type {Array<Topic>}
     * @memberof OpportunityResponseData
     */
    topics: Array<Topic>;
}


/**
 * @export
 */
export const OpportunityResponseDataStatusEnum = {
    New: 'New',
    Solved: 'Solved',
    Planned: 'Planned',
    InProgress: 'InProgress'
} as const;
export type OpportunityResponseDataStatusEnum = typeof OpportunityResponseDataStatusEnum[keyof typeof OpportunityResponseDataStatusEnum];

/**
 * @export
 */
export const OpportunityResponseDataSolutionsGeneratingStateEnum = {
    Generating: 'generating',
    Generated: 'generated',
    Initial: 'initial',
    Error: 'error'
} as const;
export type OpportunityResponseDataSolutionsGeneratingStateEnum = typeof OpportunityResponseDataSolutionsGeneratingStateEnum[keyof typeof OpportunityResponseDataSolutionsGeneratingStateEnum];

/**
 * @export
 */
export const OpportunityResponseDataCreatedByEnum = {
    User: 'user',
    Generated: 'generated'
} as const;
export type OpportunityResponseDataCreatedByEnum = typeof OpportunityResponseDataCreatedByEnum[keyof typeof OpportunityResponseDataCreatedByEnum];


/**
 * Check if a given object implements the OpportunityResponseData interface.
 */
export function instanceOfOpportunityResponseData(value: object): value is OpportunityResponseData {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('read' in value) || value['read'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('description' in value) || value['description'] === undefined) return false;
    if (!('solutionsGeneratingState' in value) || value['solutionsGeneratingState'] === undefined) return false;
    if (!('createdBy' in value) || value['createdBy'] === undefined) return false;
    if (!('hideContent' in value) || value['hideContent'] === undefined) return false;
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    if (!('updatedAt' in value) || value['updatedAt'] === undefined) return false;
    if (!('hasUnseenFeedback' in value) || value['hasUnseenFeedback'] === undefined) return false;
    if (!('solutions' in value) || value['solutions'] === undefined) return false;
    if (!('requirements' in value) || value['requirements'] === undefined) return false;
    if (!('feedback' in value) || value['feedback'] === undefined) return false;
    if (!('outcomes' in value) || value['outcomes'] === undefined) return false;
    if (!('topics' in value) || value['topics'] === undefined) return false;
    return true;
}

export function OpportunityResponseDataFromJSON(json: any): OpportunityResponseData {
    return OpportunityResponseDataFromJSONTyped(json, false);
}

export function OpportunityResponseDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): OpportunityResponseData {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'read': json['read'],
        'status': json['status'],
        'title': json['title'],
        'description': json['description'],
        'solutionsGeneratingState': json['solutionsGeneratingState'],
        'createdBy': json['createdBy'],
        'hideContent': json['hideContent'],
        'ownerId': json['ownerId'] == null ? undefined : json['ownerId'],
        'createdAt': json['createdAt'],
        'updatedAt': json['updatedAt'],
        'hasUnseenFeedback': json['hasUnseenFeedback'],
        'solutions': ((json['solutions'] as Array<any>).map(SolutionFromJSON)),
        'requirements': ((json['requirements'] as Array<any>).map(RequirementFromJSON)),
        'feedback': ((json['feedback'] as Array<any>).map(FeedbackFromJSON)),
        'outcomes': ((json['outcomes'] as Array<any>).map(OutcomeFromJSON)),
        'topics': ((json['topics'] as Array<any>).map(TopicFromJSON)),
    };
}

export function OpportunityResponseDataToJSON(json: any): OpportunityResponseData {
    return OpportunityResponseDataToJSONTyped(json, false);
}

export function OpportunityResponseDataToJSONTyped(value?: OpportunityResponseData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'read': value['read'],
        'status': value['status'],
        'title': value['title'],
        'description': value['description'],
        'solutionsGeneratingState': value['solutionsGeneratingState'],
        'createdBy': value['createdBy'],
        'hideContent': value['hideContent'],
        'ownerId': value['ownerId'],
        'createdAt': value['createdAt'],
        'updatedAt': value['updatedAt'],
        'hasUnseenFeedback': value['hasUnseenFeedback'],
        'solutions': ((value['solutions'] as Array<any>).map(SolutionToJSON)),
        'requirements': ((value['requirements'] as Array<any>).map(RequirementToJSON)),
        'feedback': ((value['feedback'] as Array<any>).map(FeedbackToJSON)),
        'outcomes': ((value['outcomes'] as Array<any>).map(OutcomeToJSON)),
        'topics': ((value['topics'] as Array<any>).map(TopicToJSON)),
    };
}

