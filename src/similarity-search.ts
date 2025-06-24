import { z, ZodError } from "zod";
import { chatToolHelperSchema, UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";
import { OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum } from "./lib/openapi/squad/models/index.js";

export enum SimilaritySearchTool {
  SimilaritySearch = "similarity_search",
}

const filtersEnum = z
  .array(
    z.enum([
      OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum.KnowledgeBase,
      OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum.Insights,
      OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum.Opportunities,
      OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum.Solutions,
    ])
  )
  .describe(
    `Filters to apply to the search. Options are: ${OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum.KnowledgeBase} for knowledge documents, ${OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum.Insights} for feedback insights, ${OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum.Opportunities} for opportunities, ${OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum.Solutions} for solutions.`
  );

// Schema for similarity search
export const SimilaritySearchArgsSchema = z.object({
  query: z.string().describe("The search query string"),
  filters: filtersEnum.default([
    OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum.KnowledgeBase,
    OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum.Insights,
    OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum.Opportunities, 
    OrganisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequestFiltersEnum.Solutions,
  ]),
});

export const similaritySearchTool = {
  name: SimilaritySearchTool.SimilaritySearch,
  description:
    "Perform a semantic similarity search across the workspace. This searches through knowledge documents, feedback insights, opportunities, and solutions to find content similar to your query.",
  inputSchema: SimilaritySearchArgsSchema,
};

export const similaritySearch = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = SimilaritySearchArgsSchema.parse(body);

    const { query, filters } = safeBody;

    const data = await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPost({
      orgId,
      workspaceId,
      organisationsOrgIdWorkspacesWorkspaceIdSimilaritySearchPostRequest: {
        query,
        filters,
      },
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (e) {
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to perform this similarity search. Please check that all values are valid. " +
          e.errors.map(e => e.message).join(", ")
        : "I was unable to perform this similarity search. Please check that the query and filters are valid.";
    return {
      content: [
        {
          type: "text",
          text: errorMessage,
        },
      ],
    };
  }
};

export const similaritySearchTools = [similaritySearchTool];

export const runSimilaritySearchTool = (name: string) => {
  const mapper = {
    [SimilaritySearchTool.SimilaritySearch]: similaritySearch,
  };

  if (!mapper[name as keyof typeof mapper]) {
    return null;
  }
  return mapper[name as keyof typeof mapper];
};

const similaritySearchChatTool = SimilaritySearchArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Searching...",
    defaultCompletedText: "Search completed.",
  }),
);

export const vercelTool = (context: UserContext) => ({
  [SimilaritySearchTool.SimilaritySearch]: {
    description: similaritySearchTool.description,
    parameters: similaritySearchChatTool,
    execute: async (args: z.infer<typeof similaritySearchChatTool>) =>
      await similaritySearch(context, args),
  },
});