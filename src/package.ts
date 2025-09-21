import { z } from "zod";
import { InsightTool, vercelTool as insightTool } from "./insight.js";
import type { UserContext } from "./helpers/getUser.js";
import { KnowledgeTool, vercelTool as knowledgeTool } from "./knowledge.js";
import {
	OpportunityTool,
	vercelTool as opportunitiesTool,
} from "./opportunity.js";
import { OutcomeTool, vercelTool as outcomesTool } from "./outcomes.js";
import {
	SimilaritySearchTool,
	vercelTool as similaritySearchTool,
} from "./similarity-search.js";
import { SolutionTool, vercelTool as solutionsTool } from "./solutions.js";
import { WorkspaceTool, vercelTool as workspaceTool } from "./workspace.js";

export const toolsEnum = z.enum([
	KnowledgeTool.CreateKnowledge,
	KnowledgeTool.ListKnowledge,
	KnowledgeTool.GetKnowledge,
	KnowledgeTool.DeleteKnowledge,
	InsightTool.CreateInsight,
	InsightTool.ListInsights,
	InsightTool.GetInsight,
	InsightTool.DeleteInsight,
	OpportunityTool.CreateOpportunity,
	OpportunityTool.ListOpportunities,
	OpportunityTool.UpdateOpportunity,
	OpportunityTool.GetOpportunity,
	OpportunityTool.DeleteOpportunity,
	SolutionTool.CreateSolution,
	SolutionTool.ListSolutions,
	SolutionTool.UpdateSolution,
	SolutionTool.GetSolution,
	SolutionTool.DeleteSolution,
	OutcomeTool.CreateOutcome,
	OutcomeTool.ListOutcomes,
	OutcomeTool.UpdateOutcome,
	OutcomeTool.GetOutcome,
	OutcomeTool.DeleteOutcome,
	WorkspaceTool.GetWorkspace,
	WorkspaceTool.UpdateWorkspace,
	SimilaritySearchTool.SimilaritySearch,
]);

export const tools = (context: UserContext) => ({
	...knowledgeTool(context),
	...workspaceTool(context),
	...solutionsTool(context),
	...opportunitiesTool(context),
	...insightTool(context),
	...outcomesTool(context),
	...similaritySearchTool(context),
});
