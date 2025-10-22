/**
 * Test data generators for creating consistent test data
 */

export function generateTestOpportunity() {
  const timestamp = Date.now();
  return {
    title: `Test Opportunity ${timestamp}`,
    description: `This is a test opportunity created at ${new Date().toISOString()}. It should be automatically cleaned up after tests.`,
  };
}

export function generateTestSolution() {
  const timestamp = Date.now();
  return {
    title: `Test Solution ${timestamp}`,
    description: `Test solution created at ${new Date().toISOString()}`,
    prd: `# Product Requirements Document

## Overview
This is a test PRD created for integration testing purposes.

## Requirements
- Requirement 1: Test feature A
- Requirement 2: Test feature B
- Requirement 3: Test feature C

## Implementation Plan
1. Step 1: Implement feature A
2. Step 2: Implement feature B
3. Step 3: Test and validate

## Acceptance Criteria
- [ ] Feature A works correctly
- [ ] Feature B integrates with Feature A
- [ ] All tests pass
`,
    pros: ["Easy to implement", "Low cost", "High impact"],
    cons: ["Requires maintenance", "May need refactoring later"],
  };
}

export function generateTestOutcome() {
  const timestamp = Date.now();
  return {
    title: `Test Outcome ${timestamp}`,
    description: `Test outcome for measuring success, created at ${new Date().toISOString()}`,
  };
}

export function generateTestKnowledge() {
  const timestamp = Date.now();
  return {
    title: `Test Knowledge ${timestamp}`,
    description: `Test knowledge document summary created at ${new Date().toISOString()}`,
    content: `# Test Knowledge Document

This is test knowledge content created for integration testing.

## Section 1
Some important information here.

## Section 2
More details about the topic.

## Conclusion
This is a test document and should be cleaned up after tests complete.
`,
  };
}

export function generateTestInsight() {
  const timestamp = Date.now();
  return {
    type: "Feedback" as const,
    title: `Test Insight ${timestamp}`,
    description: `Test customer feedback created at ${new Date().toISOString()}. This is test feedback from a customer. The customer mentioned that they would like to see improvements in the product's usability and performance.`,
  };
}
