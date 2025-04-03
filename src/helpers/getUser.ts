import { squadClient } from "../lib/clients/squad.js";

export type UserContext = {
    orgId: string;
    workspaceId: string;
};

let context: UserContext | null = null;

export const getUserContext = async () => {
    try {
        if (context) {
            return context;
        }
        const user = await squadClient().v1WhoamiGet();
        const orgId = user.data.organisation.id;
        const workspaceId = user.data.workspace.id;

        context = { orgId, workspaceId };
        return context;
    } catch (e) {
        console.error("error", e)
        throw e;
    }
};
