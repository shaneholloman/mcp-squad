/* tslint:disable */
/* eslint-disable */
/**
 * Squad API
 * API for managing Squad resources
 *
 * The version of the OpenAPI document: 0.14.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { KnowledgeBaseDocument } from "./KnowledgeBaseDocument.js";
import {
  KnowledgeBaseDocumentFromJSON,
  KnowledgeBaseDocumentToJSON,
} from "./KnowledgeBaseDocument.js";

/**
 * Uploaded document information
 * @export
 * @interface KnowledgeBaseDocumentUploadResponse
 */
export interface KnowledgeBaseDocumentUploadResponse {
  /**
   *
   * @type {KnowledgeBaseDocument}
   * @memberof KnowledgeBaseDocumentUploadResponse
   */
  data: KnowledgeBaseDocument;
}

/**
 * Check if a given object implements the KnowledgeBaseDocumentUploadResponse interface.
 */
export function instanceOfKnowledgeBaseDocumentUploadResponse(
  value: object,
): value is KnowledgeBaseDocumentUploadResponse {
  if (!("data" in value) || value["data"] === undefined) return false;
  return true;
}

export function KnowledgeBaseDocumentUploadResponseFromJSON(
  json: any,
): KnowledgeBaseDocumentUploadResponse {
  return KnowledgeBaseDocumentUploadResponseFromJSONTyped(json, false);
}

export function KnowledgeBaseDocumentUploadResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): KnowledgeBaseDocumentUploadResponse {
  if (json == null) {
    return json;
  }
  return {
    data: KnowledgeBaseDocumentFromJSON(json["data"]),
  };
}

export function KnowledgeBaseDocumentUploadResponseToJSON(
  json: any,
): KnowledgeBaseDocumentUploadResponse {
  return KnowledgeBaseDocumentUploadResponseToJSONTyped(json, false);
}

export function KnowledgeBaseDocumentUploadResponseToJSONTyped(
  value?: KnowledgeBaseDocumentUploadResponse | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    data: KnowledgeBaseDocumentToJSON(value["data"]),
  };
}
