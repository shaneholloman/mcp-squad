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
import type { SolutionRefinementLogInner } from './SolutionRefinementLogInner.js';
import {
    SolutionRefinementLogInnerFromJSON,
    SolutionRefinementLogInnerFromJSONTyped,
    SolutionRefinementLogInnerToJSON,
    SolutionRefinementLogInnerToJSONTyped,
} from './SolutionRefinementLogInner.js';
import type { Outcome } from './Outcome.js';
import {
    OutcomeFromJSON,
    OutcomeFromJSONTyped,
    OutcomeToJSON,
    OutcomeToJSONTyped,
} from './Outcome.js';
import type { Opportunity } from './Opportunity.js';
import {
    OpportunityFromJSON,
    OpportunityFromJSONTyped,
    OpportunityToJSON,
    OpportunityToJSONTyped,
} from './Opportunity.js';

/**
 * Solution with relationships
 * @export
 * @interface SolutionWithRelationships
 */
export interface SolutionWithRelationships {
    /**
     * 
     * @type {Array<Opportunity>}
     * @memberof SolutionWithRelationships
     */
    opportunities: Array<Opportunity>;
    /**
     * 
     * @type {Array<Requirement>}
     * @memberof SolutionWithRelationships
     */
    requirements: Array<Requirement>;
    /**
     * 
     * @type {Array<Feedback>}
     * @memberof SolutionWithRelationships
     */
    feedback: Array<Feedback>;
    /**
     * 
     * @type {Array<Outcome>}
     * @memberof SolutionWithRelationships
     */
    outcomes: Array<Outcome>;
    /**
     * 
     * @type {string}
     * @memberof SolutionWithRelationships
     */
    id: string;
    /**
     * System prompt used to generate the requirement
     * @type {string}
     * @memberof SolutionWithRelationships
     */
    systemPrompt?: string | null;
    /**
     * Current state of AI processing
     * @type {string}
     * @memberof SolutionWithRelationships
     */
    aiProcessingState: SolutionWithRelationshipsAiProcessingStateEnum;
    /**
     * Log of refinements made to the requirement
     * @type {Array<SolutionRefinementLogInner>}
     * @memberof SolutionWithRelationships
     */
    refinementLog: Array<SolutionRefinementLogInner>;
    /**
     * Title of the solution
     * @type {string}
     * @memberof SolutionWithRelationships
     */
    title: string;
    /**
     * Description of the solution
     * @type {string}
     * @memberof SolutionWithRelationships
     */
    description: string;
    /**
     * Solution status
     * @type {string}
     * @memberof SolutionWithRelationships
     */
    status: SolutionWithRelationshipsStatusEnum;
    /**
     * List of pros/advantages for this solution
     * @type {Array<string>}
     * @memberof SolutionWithRelationships
     */
    pros: Array<string>;
    /**
     * List of cons/disadvantages for this solution
     * @type {Array<string>}
     * @memberof SolutionWithRelationships
     */
    cons: Array<string>;
    /**
     * Whether the solution content should be hidden
     * @type {boolean}
     * @memberof SolutionWithRelationships
     */
    hideContent: boolean;
    /**
     * How the solution was created
     * @type {string}
     * @memberof SolutionWithRelationships
     */
    createdBy: SolutionWithRelationshipsCreatedByEnum;
    /**
     * ID of the solution owner
     * @type {string}
     * @memberof SolutionWithRelationships
     */
    ownerId?: string;
    /**
     * Creation timestamp
     * @type {string}
     * @memberof SolutionWithRelationships
     */
    createdAt: string;
    /**
     * Last update timestamp
     * @type {string}
     * @memberof SolutionWithRelationships
     */
    updatedAt: string;
    /**
     * User indicated priority for the solution (fractional-indexing string)
     * @type {string}
     * @memberof SolutionWithRelationships
     */
    priority: string;
    /**
     * Product Requirements Document content for the solution
     * @type {string}
     * @memberof SolutionWithRelationships
     */
    prd: string;
}


/**
 * @export
 */
export const SolutionWithRelationshipsAiProcessingStateEnum = {
    Initial: 'INITIAL',
    Processing: 'PROCESSING',
    Finished: 'FINISHED',
    Error: 'ERROR'
} as const;
export type SolutionWithRelationshipsAiProcessingStateEnum = typeof SolutionWithRelationshipsAiProcessingStateEnum[keyof typeof SolutionWithRelationshipsAiProcessingStateEnum];

/**
 * @export
 */
export const SolutionWithRelationshipsStatusEnum = {
    Backlog: 'Backlog',
    New: 'New',
    Planned: 'Planned',
    InDevelopment: 'InDevelopment',
    Complete: 'Complete',
    Cancelled: 'Cancelled'
} as const;
export type SolutionWithRelationshipsStatusEnum = typeof SolutionWithRelationshipsStatusEnum[keyof typeof SolutionWithRelationshipsStatusEnum];

/**
 * @export
 */
export const SolutionWithRelationshipsCreatedByEnum = {
    User: 'user',
    Generated: 'generated'
} as const;
export type SolutionWithRelationshipsCreatedByEnum = typeof SolutionWithRelationshipsCreatedByEnum[keyof typeof SolutionWithRelationshipsCreatedByEnum];


/**
 * Check if a given object implements the SolutionWithRelationships interface.
 */
export function instanceOfSolutionWithRelationships(value: object): value is SolutionWithRelationships {
    if (!('opportunities' in value) || value['opportunities'] === undefined) return false;
    if (!('requirements' in value) || value['requirements'] === undefined) return false;
    if (!('feedback' in value) || value['feedback'] === undefined) return false;
    if (!('outcomes' in value) || value['outcomes'] === undefined) return false;
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('aiProcessingState' in value) || value['aiProcessingState'] === undefined) return false;
    if (!('refinementLog' in value) || value['refinementLog'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('description' in value) || value['description'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    if (!('pros' in value) || value['pros'] === undefined) return false;
    if (!('cons' in value) || value['cons'] === undefined) return false;
    if (!('hideContent' in value) || value['hideContent'] === undefined) return false;
    if (!('createdBy' in value) || value['createdBy'] === undefined) return false;
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    if (!('updatedAt' in value) || value['updatedAt'] === undefined) return false;
    if (!('priority' in value) || value['priority'] === undefined) return false;
    if (!('prd' in value) || value['prd'] === undefined) return false;
    return true;
}

export function SolutionWithRelationshipsFromJSON(json: any): SolutionWithRelationships {
    return SolutionWithRelationshipsFromJSONTyped(json, false);
}

export function SolutionWithRelationshipsFromJSONTyped(json: any, ignoreDiscriminator: boolean): SolutionWithRelationships {
    if (json == null) {
        return json;
    }
    return {
        
        'opportunities': ((json['opportunities'] as Array<any>).map(OpportunityFromJSON)),
        'requirements': ((json['requirements'] as Array<any>).map(RequirementFromJSON)),
        'feedback': ((json['feedback'] as Array<any>).map(FeedbackFromJSON)),
        'outcomes': ((json['outcomes'] as Array<any>).map(OutcomeFromJSON)),
        'id': json['id'],
        'systemPrompt': json['systemPrompt'] == null ? undefined : json['systemPrompt'],
        'aiProcessingState': json['aiProcessingState'],
        'refinementLog': ((json['refinementLog'] as Array<any>).map(SolutionRefinementLogInnerFromJSON)),
        'title': json['title'],
        'description': json['description'],
        'status': json['status'],
        'pros': json['pros'],
        'cons': json['cons'],
        'hideContent': json['hideContent'],
        'createdBy': json['createdBy'],
        'ownerId': json['ownerId'] == null ? undefined : json['ownerId'],
        'createdAt': json['createdAt'],
        'updatedAt': json['updatedAt'],
        'priority': json['priority'],
        'prd': json['prd'],
    };
}

export function SolutionWithRelationshipsToJSON(json: any): SolutionWithRelationships {
    return SolutionWithRelationshipsToJSONTyped(json, false);
}

export function SolutionWithRelationshipsToJSONTyped(value?: SolutionWithRelationships | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'opportunities': ((value['opportunities'] as Array<any>).map(OpportunityToJSON)),
        'requirements': ((value['requirements'] as Array<any>).map(RequirementToJSON)),
        'feedback': ((value['feedback'] as Array<any>).map(FeedbackToJSON)),
        'outcomes': ((value['outcomes'] as Array<any>).map(OutcomeToJSON)),
        'id': value['id'],
        'systemPrompt': value['systemPrompt'],
        'aiProcessingState': value['aiProcessingState'],
        'refinementLog': ((value['refinementLog'] as Array<any>).map(SolutionRefinementLogInnerToJSON)),
        'title': value['title'],
        'description': value['description'],
        'status': value['status'],
        'pros': value['pros'],
        'cons': value['cons'],
        'hideContent': value['hideContent'],
        'createdBy': value['createdBy'],
        'ownerId': value['ownerId'],
        'createdAt': value['createdAt'],
        'updatedAt': value['updatedAt'],
        'priority': value['priority'],
        'prd': value['prd'],
    };
}

