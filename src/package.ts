import { z } from "zod";
import { vercelTool as feedbackTool, FeedbackTool } from "./feedback.js";
import { UserContext } from "./helpers/getUser.js";
import { vercelTool as knowledgeTool, KnowledgeTool } from "./knowledge.js";
import {
  vercelTool as opportunitiesTool,
  OpportunityTool,
} from "./opportunity.js";
import { vercelTool as outcomesTool, OutcomeTool } from "./outcomes.js";
import {
  vercelTool as requirementsTool,
  RequirementTool,
} from "./requirements.js";
import { vercelTool as solutionsTool, SolutionTool } from "./solutions.js";
import { vercelTool as workspaceTool, WorkspaceTool } from "./workspace.js";

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
  OpportunityTool.GetOpportunity,
  OpportunityTool.DeleteOpportunity,
  SolutionTool.CreateSolution,
  SolutionTool.ListSolutions,
  SolutionTool.GetSolution,
  SolutionTool.DeleteSolution,
  OutcomeTool.CreateOutcome,
  OutcomeTool.ListOutcomes,
  OutcomeTool.GetOutcome,
  OutcomeTool.DeleteOutcome,
  RequirementTool.CreateRequirement,
  RequirementTool.ListRequirements,
  RequirementTool.GetRequirement,
  RequirementTool.DeleteRequirement,
  WorkspaceTool.GetWorkspace,
  WorkspaceTool.UpdateWorkspace,
]);

export const tools = (context: UserContext) => ({
  ...knowledgeTool(context),
  ...workspaceTool(context),
  ...solutionsTool(context),
  ...opportunitiesTool(context),
  ...feedbackTool(context),
  ...outcomesTool(context),
  ...requirementsTool(context),
});
