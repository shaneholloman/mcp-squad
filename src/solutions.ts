import { z, ZodError } from "zod";
import { chatToolHelperSchema, UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";
import {
  CreateSolutionPayload,
  CreateSolutionPayloadStatusEnum,
  RelationshipAction,
  SolutionRelationshipsPayload,
  UpdateSolutionPayload,
} from "./lib/openapi/squad/models/index.js";

export enum SolutionTool {
  CreateSolution = "create_solution",
  ListSolutions = "list_solutions",
  GetSolution = "get_solution",
  UpdateSolution = "update_solution",
  DeleteSolution = "delete_solution",
  ManageSolutionRelationships = "manage_solution_relationships",
}

const statusEnum = z
  .enum([
    CreateSolutionPayloadStatusEnum.New,
    CreateSolutionPayloadStatusEnum.InDevelopment,
    CreateSolutionPayloadStatusEnum.Planned,
    CreateSolutionPayloadStatusEnum.Complete,
    CreateSolutionPayloadStatusEnum.Cancelled,
    CreateSolutionPayloadStatusEnum.Backlog,
  ])
  .optional()
  .describe(
    `Status of the solution: ${CreateSolutionPayloadStatusEnum.New} hasn't been developed, ${CreateSolutionPayloadStatusEnum.InDevelopment} means we're currently building out requirements and implementing them. ${CreateSolutionPayloadStatusEnum.Planned} means we've finished developing the solutions and are ready to implement them. ${CreateSolutionPayloadStatusEnum.Complete} means we've completed the implementation and the opportunity is considered addressed. ${CreateSolutionPayloadStatusEnum.Cancelled} means we've cancelled the implementation and the opportunity is no longer considered addressed. ${CreateSolutionPayloadStatusEnum.Backlog} means we've added this to the backlog and it will be worked on in the future.`,
  );

// Schema for creating a solution
export const CreateSolutionArgsSchema = z.object({
  title: z.string().describe("A short title for the solution"),
  description: z.string().describe("A brief AI-friendly summary of the solution for context and search purposes. Keep this concise."),
  prd: z.string().describe("The complete Product Requirements Document (PRD) containing the full detailed specification, implementation plan, and requirements for this solution. This is the primary content field."),
  pros: z
    .array(z.string())
    .describe(
      "List of pros/benefits of this solution. This is a sentence or two max.",
    ),
  cons: z
    .array(z.string())
    .describe(
      "List of cons/drawbacks of this solution. This is a sentence or two max.",
    ),
  status: statusEnum,
});

export const createSolutionTool = {
  name: SolutionTool.CreateSolution,
  description:
    "Create a new solution. A solution is a proposed approach to address an opportunity. The 'prd' field should contain the complete detailed specification, while 'description' should be a brief summary for AI context.",
  inputSchema: CreateSolutionArgsSchema,
};

export const createSolution = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = CreateSolutionArgsSchema.parse(body);

    const { title, description, pros, cons, status, prd } = safeBody;

    const solutionPayload: CreateSolutionPayload = {
      title,
      description,
      pros,
      cons,
      status: status || CreateSolutionPayloadStatusEnum.New,
      createdBy: "user",
      prd: prd,
    };

    const data = await squadClient(
      context.jwt,
    ).createSolution({
      orgId,
      workspaceId,
      createSolutionPayload: solutionPayload,
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
    console.error("Error creating solution:", e);
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to create this solution. Please check that all values are valid. " +
        e.errors.map(e => e.message).join(", ")
        : "I was unable to create this solution. Please check that all values are valid.";
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

// Schema for listing solutions
export const ListSolutionsArgsSchema = z.object({});

export const listSolutionsTool = {
  name: SolutionTool.ListSolutions,
  description:
    "List all solutions in the workspace. Solutions are proposed approaches to address opportunities.",
  inputSchema: ListSolutionsArgsSchema,
};

export const listSolutions = async (
  context: UserContext,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const solutions = await squadClient(
      context.jwt,
    ).listSolutions({
      orgId,
      workspaceId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(solutions),
        },
      ],
    };
  } catch (e) {
    console.error("error", e);
    return {
      content: [
        {
          type: "text",
          text: "I was unable to list solutions. Please check that the workspace ID is correct.",
        },
      ],
    };
  }
};

// Schema for getting a single solution
export const GetSolutionArgsSchema = z.object({
  solutionId: z.string().describe("The ID of the solution to retrieve"),
  relationships: z
    .array(z.enum(["opportunities", "outcomes", "insights"]))
    .optional()
    .describe(
      "Relationships to include in the response. Opportunities are problem statements identified for the organisation. Outcomes are business objectives/goals. Feedback is additional information or insights related to the opportunity.",
    )
    .default([]),
});

export const getSolutionTool = {
  name: SolutionTool.GetSolution,
  description: "Get details of a specific solution by ID.",
  inputSchema: GetSolutionArgsSchema,
};

export const getSolution = async (
  context: UserContext,
  args: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const safeArgs = GetSolutionArgsSchema.parse(args);
    const { solutionId } = safeArgs;
    const { orgId, workspaceId } = context;

    const solution = await squadClient(
      context.jwt,
    ).getSolution({
      orgId,
      workspaceId,
      solutionId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(solution),
        },
      ],
    };
  } catch (e) {
    console.error("Error getting solution:", e);
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to retrieve this solution. Please check that all values are valid. " +
        e.errors.map(e => e.message).join(", ")
        : "I was unable to retrieve this solution. Please check that the ID is correct.";
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

// Schema for updating a solution
export const UpdateSolutionArgsSchema = z.object({
  solutionId: z.string().describe("The ID of the solution to update"),
  title: z.string().optional().describe("Updated title"),
  description: z.string().optional().describe("Updated brief AI-friendly summary for context and search purposes"),
  prd: z.string().optional().describe("Updated complete Product Requirements Document (PRD) containing the full detailed specification and implementation plan"),
  pros: z
    .array(z.string())
    .optional()
    .describe("Updated list of pros/benefits"),
  cons: z
    .array(z.string())
    .optional()
    .describe("Updated list of cons/drawbacks"),
  status: statusEnum,
});

export const updateSolutionTool = {
  name: SolutionTool.UpdateSolution,
  description:
    "Update an existing solution's details such as title, description, pros, cons, or status.",
  inputSchema: UpdateSolutionArgsSchema,
};
export const updateSolution = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const { solutionId, ...safePayload } = UpdateSolutionArgsSchema.parse(body);

    const updatePayload: UpdateSolutionPayload = {
      ...safePayload,
      updateTriggeredBy: "AI",
    };

    const solution = await squadClient(
      context.jwt,
    ).updateSolution({
      orgId,
      workspaceId,
      solutionId,
      updateSolutionPayload: updatePayload,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(solution),
        },
      ],
    };
  } catch (e) {
    console.error("Error getting solution:", e);
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to update this solution. Please check that all values are valid. " +
        e.errors.map(e => e.message).join(", ")
        : "I was unable to update this solution. Please check that all values are valid.";
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

// Schema for deleting a solution
export const DeleteSolutionArgsSchema = z.object({
  solutionId: z.string().describe("The ID of the solution to delete"),
});

export const deleteSolutionTool = {
  name: SolutionTool.DeleteSolution,
  description: "Delete a solution by ID.",
  inputSchema: DeleteSolutionArgsSchema,
};

export const deleteSolution = async (
  context: UserContext,
  args: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;

    const safeArgs = DeleteSolutionArgsSchema.parse(args);
    const { solutionId } = safeArgs;

    await squadClient(
      context.jwt,
    ).deleteSolution({
      orgId,
      workspaceId,
      solutionId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            data: {
              id: solutionId,
            },
          }),
        },
      ],
    };
  } catch (e) {
    console.error("error", e);
    const errorMessage =
      e instanceof ZodError
        ? "I was unable to delete this solution. Please check that all values are valid. " +
        e.errors.map(e => e.message).join(", ")
        : "I was unable to delete this solution. Please check that the ID is correct.";
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

// Schema for managing solution relationships
export const ManageSolutionRelationshipsArgsSchema = z.object({
  solutionId: z
    .string()
    .describe("The ID of the solution to manage relationships for"),
  action: z
    .enum(["add", "remove"])
    .describe("Whether to add or remove the relationships"),
  opportunityIds: z
    .array(z.string())
    .optional()
    .describe("IDs of opportunities to relate to this solution"),
});

export const manageSolutionRelationshipsTool = {
  name: SolutionTool.ManageSolutionRelationships,
  description:
    "Add or remove relationships between a solution and other entities (opportunities).",
  inputSchema: ManageSolutionRelationshipsArgsSchema,
};

export const manageSolutionRelationships = async (
  context: UserContext,
  args: Record<string, unknown> | undefined,
): Promise<{
  content: { type: "text"; text: string }[];
}> => {
  try {
    const { orgId, workspaceId } = context;

    const safeArgs = ManageSolutionRelationshipsArgsSchema.parse(args);
    const { solutionId, action, opportunityIds } = safeArgs;

    const relationshipsPayload: SolutionRelationshipsPayload = {
      opportunityIds: opportunityIds || [],
    };

    await squadClient(context.jwt).manageSolutionRelationships({
      orgId,
      workspaceId,
      solutionId,
      action: action as RelationshipAction,
      solutionRelationshipsPayload: relationshipsPayload,
    });

    const data = await squadClient(
      context.jwt,
    ).getSolution({
      orgId,
      workspaceId,
      solutionId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data),
        },
      ],
    };
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

export const solutionTools = [
  createSolutionTool,
  listSolutionsTool,
  getSolutionTool,
  updateSolutionTool,
  deleteSolutionTool,
  manageSolutionRelationshipsTool,
];

export const runSolutionTool = (name: string) => {
  const mapper = {
    [SolutionTool.CreateSolution]: createSolution,
    [SolutionTool.ListSolutions]: listSolutions,
    [SolutionTool.GetSolution]: getSolution,
    [SolutionTool.UpdateSolution]: updateSolution,
    [SolutionTool.DeleteSolution]: deleteSolution,
    [SolutionTool.ManageSolutionRelationships]: manageSolutionRelationships,
  };

  if (!mapper[name as keyof typeof mapper]) {
    return null;
  }
  return mapper[name as keyof typeof mapper];
};

const createSolutionChatTool = CreateSolutionArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Creating solution...",
    defaultCompletedText: "Solution created.",
  }),
);

const listSolutionsChatTool = listSolutionsTool.inputSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Listing solutions...",
    defaultCompletedText: "Solutions listed.",
  }),
);

const getSolutionChatTool = GetSolutionArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Getting solution...",
    defaultCompletedText: "Solution retrieved.",
  }),
);

const updateSolutionChatTool = UpdateSolutionArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Updating solution...",
    defaultCompletedText: "Solution updated.",
  }),
);

const deleteSolutionChatTool = DeleteSolutionArgsSchema.merge(
  chatToolHelperSchema({
    defaultInProgressText: "Deleting solution...",
    defaultCompletedText: "Solution deleted.",
  }),
);

const manageSolutionRelationshipsChatTool =
  ManageSolutionRelationshipsArgsSchema.merge(
    chatToolHelperSchema({
      defaultInProgressText: "Managing solution relationships...",
      defaultCompletedText: "Solution relationships managed.",
    }),
  );

export const vercelTool = (context: UserContext) => ({
  [SolutionTool.CreateSolution]: {
    description: createSolutionTool.description,
    parameters: createSolutionChatTool,
    execute: async (args: z.infer<typeof createSolutionChatTool>) =>
      await createSolution(context, args),
  },
  [SolutionTool.ListSolutions]: {
    description: listSolutionsTool.description,
    parameters: listSolutionsChatTool,
    execute: async (args: z.infer<typeof listSolutionsChatTool>) =>
      await listSolutions(context),
  },
  [SolutionTool.GetSolution]: {
    description: getSolutionTool.description,
    parameters: getSolutionChatTool,
    execute: async (args: z.infer<typeof getSolutionChatTool>) =>
      await getSolution(context, args),
  },
  [SolutionTool.UpdateSolution]: {
    description: updateSolutionTool.description,
    parameters: updateSolutionChatTool,
    execute: async (args: z.infer<typeof updateSolutionChatTool>) =>
      await updateSolution(context, args),
  },
  [SolutionTool.DeleteSolution]: {
    description: deleteSolutionTool.description,
    parameters: deleteSolutionChatTool,
    execute: async (args: z.infer<typeof deleteSolutionChatTool>) =>
      await deleteSolution(context, args),
  },
  [SolutionTool.ManageSolutionRelationships]: {
    description: manageSolutionRelationshipsTool.description,
    parameters: manageSolutionRelationshipsChatTool,
    execute: async (
      args: z.infer<typeof manageSolutionRelationshipsChatTool>,
    ) => await manageSolutionRelationships(context, args),
  },
});
