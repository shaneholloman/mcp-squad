import { z } from "zod";
import { FeedbackTool, vercelTool as feedbackTool } from "./feedback.js";
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
	FeedbackTool.CreateFeedback,
	FeedbackTool.ListFeedback,
	FeedbackTool.GetFeedback,
	FeedbackTool.DeleteFeedback,
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
	...feedbackTool(context),
	...outcomesTool(context),
	...similaritySearchTool(context),
});
