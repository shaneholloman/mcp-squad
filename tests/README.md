# Squad MCP Integration Tests

This directory contains comprehensive integration tests for the Squad MCP server. These tests make actual API calls to verify that all tools work correctly end-to-end.

## Setup

1. **Install dependencies**:
   ```bash
   yarn install
   ```

2. **Build the project**:
   ```bash
   yarn build
   ```

3. **Configure test environment**:
   Copy `.env.test.example` to `.env.test` and add your Squad API key:
   ```bash
   cp .env.test.example .env.test
   ```

   Edit `.env.test` and add your API key:
   ```
   SQUAD_API_KEY=your-api-key-here
   ```

## Running Tests

### Run all tests
```bash
yarn test
```

### Run tests in watch mode
```bash
yarn test:watch
```

### Run tests with UI
```bash
yarn test:ui
```

### Run tests with coverage
```bash
yarn test:coverage
```

### Run specific test file
```bash
yarn test tests/integration/opportunity.test.ts
```

## Test Structure

The integration tests are organized by tool category:

- **opportunity.test.ts**: Tests for opportunity management tools
  - create_opportunity
  - list_opportunities
  - get_opportunity
  - update_opportunity
  - delete_opportunity
  - generate_solutions
  - manage_opportunity_relationships

- **solution.test.ts**: Tests for solution management tools
  - create_solution
  - list_solutions
  - get_solution
  - update_solution
  - delete_solution
  - manage_solution_relationships

- **outcome.test.ts**: Tests for outcome management tools
  - create_outcome
  - list_outcomes
  - get_outcome
  - update_outcome
  - delete_outcome
  - manage_outcome_relationships

- **knowledge.test.ts**: Tests for knowledge base tools
  - create_knowledge
  - list_knowledge
  - get_knowledge
  - delete_knowledge

- **insight.test.ts**: Tests for insight/feedback tools
  - create_insight
  - list_insights
  - get_insight
  - delete_insight

- **workspace.test.ts**: Tests for workspace management tools
  - get_workspace
  - update_workspace

- **similarity-search.test.ts**: Tests for similarity search functionality
  - similarity_search with various filters

## Helper Files

### `helpers/test-client.ts`
Contains utilities for creating MCP test clients and calling tools:
- `createTestMCPClient()`: Creates a client connected to the MCP server
- `callTool()`: Calls a tool and returns the result
- `parseToolResponse()`: Parses JSON responses from tools

### `helpers/test-data.ts`
Contains data generators for creating consistent test data:
- `generateTestOpportunity()`
- `generateTestSolution()`
- `generateTestOutcome()`
- `generateTestKnowledge()`
- `generateTestInsight()`

### `setup.ts`
Handles test environment setup:
- Loads environment variables from `.env.test`
- Validates required configuration
- Provides API key access for tests

## Test Lifecycle

Each test suite follows this pattern:

1. **beforeAll**:
   - Creates MCP client connection
   - May create test data for read operations

2. **Test execution**:
   - Tests are independent and can run in any order
   - Create operations save IDs for later cleanup
   - Update operations verify changes
   - Delete operations are tested with dedicated items

3. **afterAll**:
   - Cleans up created test data
   - Closes MCP client connection

## Writing New Tests

To add a new test:

1. Create a new test file in `tests/integration/`
2. Import test utilities from `helpers/`
3. Follow the existing test patterns
4. Ensure proper cleanup in `afterAll`

Example:
```typescript
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import {
  createTestMCPClient,
  callTool,
  parseToolResponse,
  TestMCPClient,
} from "../helpers/test-client.js";
import { getApiKey } from "../setup.js";

describe("My New Tool Tests", () => {
  let testClient: TestMCPClient;

  beforeAll(async () => {
    const apiKey = getApiKey();
    testClient = await createTestMCPClient(apiKey);
  });

  afterAll(async () => {
    await testClient.cleanup();
  });

  it("should do something", async () => {
    const result = await callTool(testClient.client, "my_tool");
    expect(result).toBeDefined();
  });
});
```

## Troubleshooting

### Tests fail with "SQUAD_API_KEY is required"
Make sure you've created `.env.test` with your API key.

### Tests timeout
The default timeout is 30 seconds. If tests are timing out:
- Check your network connection
- Verify your API key is valid
- Check the Squad API status

### Server connection errors
Make sure the project is built before running tests:
```bash
yarn build
```

### Cleanup failures
Tests attempt to clean up created resources. If cleanup fails, you may need to manually delete test items from your Squad workspace.

## Coverage

To view test coverage:
```bash
yarn test:coverage
```

This will generate a coverage report in the `coverage/` directory.

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run integration tests
  run: |
    yarn build
    yarn test
  env:
    SQUAD_API_KEY: ${{ secrets.SQUAD_API_KEY }}
```

**Note**: Store the API key as a secret in your CI/CD environment, not in the repository.
