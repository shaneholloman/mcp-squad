import { vercelTool as knowledgeTool } from "./knowledge.js";
import { vercelTool as workspaceTool } from "./workspace.js";
import { vercelTool as solutionsTool } from "./solutions.js";
import { vercelTool as opportunitiesTool } from "./opportunity.js";
import { vercelTool as feedbackTool } from "./feedback.js";
import { vercelTool as outcomesTool } from "./outcomes.js";
import { vercelTool as requirementsTool } from "./requirements.js";
import { UserContext } from "./helpers/getUser.js";

export const tools = (context: UserContext) => ({
    ...knowledgeTool(context),
    ...workspaceTool(context),
    ...solutionsTool(context),
    ...opportunitiesTool(context),
    ...feedbackTool(context),
    ...outcomesTool(context),
    ...requirementsTool(context),
});