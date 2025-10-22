import { z } from "zod";
import { squadClient } from "../lib/clients/squad.js";

export type UserContext = {
  orgId: string;
  workspaceId: string;
  jwt?: string;
};

let context: UserContext | null = null;

export const getUserContext = async () => {
  try {
    if (context) {
      return context;
    }
    const user = await squadClient().whoAmI();
    const orgId = user.data.organisation.id;
    const workspaceId = user.data.workspace.id;

    context = { orgId, workspaceId };
    return context;
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

export const chatToolHelperSchema = ({
  defaultInProgressText = "Thinking...",
  defaultCompletedText = "Done",
}: {
  defaultInProgressText?: string;
  defaultCompletedText?: string;
}) =>
  z.object({
    inProgressText: z
      .string()
      .optional()
      .default(defaultInProgressText)
      .describe("Text to display while the tool is in progress"),
    completedText: z
      .string()
      .optional()
      .default(defaultCompletedText)
      .describe("Text to display when the tool has completed"),
  });
