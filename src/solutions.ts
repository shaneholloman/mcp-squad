import { z, ZodError } from "zod";
import { UserContext } from "./helpers/getUser.js";
import { squadClient } from "./lib/clients/squad.js";
import {
  CreateSolutionPayload,
  CreateSolutionPayloadStatusEnum,
  RelationshipAction,
  SolutionRelationshipsPayload,
  UpdateSolutionPayload,
} from "./lib/openapi/squad/models/index.js";

const statusEnum = z
  .enum([
    CreateSolutionPayloadStatusEnum.New,
    CreateSolutionPayloadStatusEnum.InProgress,
    CreateSolutionPayloadStatusEnum.Planned,
    CreateSolutionPayloadStatusEnum.Solved,
  ])
  .optional()
  .describe(
    `Status of the solution: ${CreateSolutionPayloadStatusEnum.New} hasn't been developed, ${CreateSolutionPayloadStatusEnum.InProgress} means we're currently building out requirements and implementing them. ${CreateSolutionPayloadStatusEnum.Planned} means we've finished developing the solutions and are ready to implement them. ${CreateSolutionPayloadStatusEnum.Solved} means we've completed the implementation and the opportunity is considered addressed.`,
  );

// Schema for creating a solution
export const CreateSolutionArgsSchema = z.object({
  title: z.string().describe("A short title for the solution"),
  description: z.string().describe("A description of the solution."),
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
  name: "create_solution",
  description:
    "Create a new solution. A solution is a proposed approach to address an opportunity. A solution will be a detailed plan to address an opportunity.",
  inputSchema: CreateSolutionArgsSchema,
};

export const createSolution = async (
  context: UserContext,
  body: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const safeBody = CreateSolutionArgsSchema.parse(body);

    const { title, description, pros, cons, status } = safeBody;

    const solutionPayload: CreateSolutionPayload = {
      title,
      description,
      pros,
      cons,
      status: status || CreateSolutionPayloadStatusEnum.New,
      createdBy: "user",
    };

    const solution = await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdSolutionsPost({
      orgId,
      workspaceId,
      createSolutionPayload: solutionPayload,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              solution,
            },
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
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
  name: "list_solutions",
  description:
    "List all solutions in the workspace. Solutions are proposed approaches to address opportunities.",
  inputSchema: ListSolutionsArgsSchema,
};

export const listSolutions = async (
  context: UserContext,
): Promise<{ content: { type: "text"; text: string }[] }> => {
  try {
    const { orgId, workspaceId } = context;

    const solutions = await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdSolutionsGet({
      orgId,
      workspaceId,
    });

    if (solutions.data.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                solutions: [],
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              solutions,
            },
            null,
            2,
          ),
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
    .array(z.enum(["opportunities", "requirements", "outcomes", "feedback"]))
    .optional()
    .describe(
      "Relationships to include in the response. Opportunities are problem statements identified for the organisation. Outcomes are business objectives/goals. Requirements are detailed steps to implement a solution. Feedback is additional information or insights related to the opportunity.",
    )
    .default([]),
});

export const getSolutionTool = {
  name: "get_solution",
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

    const solution = await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdGet({
      orgId,
      workspaceId,
      solutionId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              solution,
            },
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
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
  description: z.string().optional().describe("Updated description"),
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
  name: "update_solution",
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

    const safeSolution = UpdateSolutionArgsSchema.parse(body);

    const { solutionId, title, description, pros, cons, status } = safeSolution;

    // First, get the existing solution to preserve any values we're not updating
    const existingSolution = await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdGet({
      orgId,
      workspaceId,
      solutionId,
    });

    const updatePayload: UpdateSolutionPayload = {
      title: title || existingSolution.data.title,
      description: description || existingSolution.data.description,
      pros: pros || existingSolution.data.pros,
      cons: cons || existingSolution.data.cons,
      status: status || existingSolution.data.status,
    };

    const solution = await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdPut({
      orgId,
      workspaceId,
      solutionId,
      updateSolutionPayload: updatePayload,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              solution,
            },
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
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
  name: "delete_solution",
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

    await squadClient({
      jwt: context.jwt,
    }).organisationsOrgIdWorkspacesWorkspaceIdSolutionsSolutionIdDelete({
      orgId,
      workspaceId,
      solutionId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              solutionId,
            },
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
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
  requirementIds: z
    .array(z.string())
    .optional()
    .describe("IDs of requirements to relate to this solution"),
});

export const manageSolutionRelationshipsTool = {
  name: "manage_solution_relationships",
  description:
    "Add or remove relationships between a solution and other entities (opportunities or requirements).",
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
    const { solutionId, action, opportunityIds, requirementIds } = safeArgs;

    const relationshipsPayload: SolutionRelationshipsPayload = {
      requirementIds: requirementIds || [],
      opportunityIds: opportunityIds || [],
    };

    await squadClient({ jwt: context.jwt }).manageSolutionRelationships({
      orgId,
      workspaceId,
      solutionId,
      action: action as RelationshipAction,
      solutionRelationshipsPayload: relationshipsPayload,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              solutionId,
              action,
              opportunityIds,
              requirementIds,
            },
            null,
            2,
          ),
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
    create_solution: createSolution,
    list_solutions: listSolutions,
    get_solution: getSolution,
    update_solution: updateSolution,
    delete_solution: deleteSolution,
    manage_solution_relationships: manageSolutionRelationships,
  };

  if (!mapper[name as keyof typeof mapper]) {
    return null;
  }
  return mapper[name as keyof typeof mapper];
};

export const vercelTool = (context: UserContext) => ({
  create_solution: {
    description: createSolutionTool.description,
    parameters: createSolutionTool.inputSchema,
    execute: async (args: z.infer<typeof CreateSolutionArgsSchema>) =>
      await createSolution(context, args),
  },
  list_solutions: {
    description: listSolutionsTool.description,
    parameters: listSolutionsTool.inputSchema,
    execute: async () => await listSolutions(context),
  },
  get_solution: {
    description: getSolutionTool.description,
    parameters: getSolutionTool.inputSchema,
    execute: async (args: z.infer<typeof GetSolutionArgsSchema>) =>
      await getSolution(context, args),
  },
  update_solution: {
    description: updateSolutionTool.description,
    parameters: updateSolutionTool.inputSchema,
    execute: async (args: z.infer<typeof UpdateSolutionArgsSchema>) =>
      await updateSolution(context, args),
  },
  delete_solution: {
    description: deleteSolutionTool.description,
    parameters: deleteSolutionTool.inputSchema,
    execute: async (args: z.infer<typeof DeleteSolutionArgsSchema>) =>
      await deleteSolution(context, args),
  },
  manage_solution_relationships: {
    description: manageSolutionRelationshipsTool.description,
    parameters: manageSolutionRelationshipsTool.inputSchema,
    execute: async (
      args: z.infer<typeof ManageSolutionRelationshipsArgsSchema>,
    ) => await manageSolutionRelationships(context, args),
  },
});
