import { z, ZodError } from "zod";
import { chatToolHelperSchema, UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";
import { SimilaritySearchRequestFiltersEnum } from "./lib/openapi/squad/models/SimilaritySearchRequest.js";

export enum SimilaritySearchTool {
  SimilaritySearch = "similarity_search",
}

const filtersEnum = z
  .array(
    z.enum([
      SimilaritySearchRequestFiltersEnum.KnowledgeBase,
      SimilaritySearchRequestFiltersEnum.Insights,
      SimilaritySearchRequestFiltersEnum.Opportunities,
      SimilaritySearchRequestFiltersEnum.Solutions,
    ])
  )
  .describe(
    `Filters to apply to the search. Options are: ${SimilaritySearchRequestFiltersEnum.KnowledgeBase} for knowledge documents, ${SimilaritySearchRequestFiltersEnum.Insights} for insights, ${SimilaritySearchRequestFiltersEnum.Opportunities} for opportunities, ${SimilaritySearchRequestFiltersEnum.Solutions} for solutions.`
  );

// Schema for similarity search
export const SimilaritySearchArgsSchema = z.object({
  query: z.string().describe("The search query string"),
  filters: filtersEnum.default([
    SimilaritySearchRequestFiltersEnum.KnowledgeBase,
    SimilaritySearchRequestFiltersEnum.Insights,
    SimilaritySearchRequestFiltersEnum.Opportunities,
    SimilaritySearchRequestFiltersEnum.Solutions,
  ]),
});

export const similaritySearchTool = {
  name: SimilaritySearchTool.SimilaritySearch,
  description:
    "Perform a semantic similarity search across the workspace. This searches through knowledge documents, feedback insights, opportunities, and solutions to find content similar to your query. Each result will contain a nodeId or an id. These can be used to retrieve the full content of the entity using the get_knowledge_document, get_insight, get_opportunity, or get_solution tools.",
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

    const data = await squadClient(
      context.jwt,
    ).similaritySearch({
      orgId,
      workspaceId,
      similaritySearchRequest: {
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
    console.error("error", e);
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