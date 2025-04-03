import { z } from "zod";
import { squadClient } from "./lib/clients/squad.js";
import { OrganisationsOrgIdWorkspacesWorkspaceIdOpportunitiesGet200ResponseInner } from "./lib/openapi/squad/index.js";
import { UserContext } from "./helpers/getUser.js";

// Schema definitions
export const CreateOpportunityArgsSchema = z.object({
  title: z.string().describe("A short title"),
  description: z.string().describe("A short description of the opportunity, detailing the problem statement and opportunity for the business"),
});

export const createOpportunity = (context: UserContext) => async ({
    title,
    description
}: z.infer<typeof CreateOpportunityArgsSchema>): Promise<OrganisationsOrgIdWorkspacesWorkspaceIdOpportunitiesGet200ResponseInner> => {
    try {
        const { orgId, workspaceId } = context;

        const res = await squadClient().organisationsOrgIdWorkspacesWorkspaceIdOpportunitiesPost({
            orgId,
            workspaceId,
            createOpportunityPayload: {
                title,
                description,
                status: "New"
            }
        });
        return res;
    } catch (e) {
        console.error("error", e)
        throw e;
    }
};