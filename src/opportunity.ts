import { z } from "zod";

// Zod schema for the opportunity response
export const opportunityResponseSchema = z.object({
  body: z.object({
    data: z.object({
      createdAt: z.string().datetime(),
      read: z.boolean(),
      createdBy: z.string(),
      solutionsGeneratingState: z.string(),
      description: z.string(),
      id: z.string().uuid(),
      title: z.string(),
      ownerId: z.string().uuid(),
      hideContent: z.boolean(),
      updatedAt: z.string().datetime(),
      status: z.string(),
      hasUnseenFeedback: z.boolean()
    })
  })
});

// Type inference from the schema
export type OpportunityResponse = z.infer<typeof opportunityResponseSchema>;

// For just the opportunity data
export const opportunityDataSchema = opportunityResponseSchema.shape.body.shape.data;
export type OpportunityData = z.infer<typeof opportunityDataSchema>;

export const createOpportunity = async ({
    title,
    description
}: {
    title: string,
    description: string,
}): Promise<OpportunityData> => {
    const orgId = "20bdae02-dc83-4c8a-85ef-844d8ae63fc3";
    const workspaceId = "982c5a66-447e-4a90-bd90-8e18b19a2a10";
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImEzYjcyM2Y0LTc0YzMtNGJiOC1iYWZmLWQ3MDY1ODE0N2RiZCJ9.eyJzdWIiOiJkZjk4YTkwNC00NjgyLTQ4ZGUtYWM5My03ZmNiODkwNDVhZGEiLCJpYXQiOjE3NDM1MjMzMTAsImV4cCI6MTc0MzUyNTExMCwidXNlcl9pZCI6ImRmOThhOTA0LTQ2ODItNDhkZS1hYzkzLTdmY2I4OTA0NWFkYSIsImlzcyI6Imh0dHBzOi8vMjY5MDQwODg0MzAucHJvcGVsYXV0aHRlc3QuY29tIiwiZW1haWwiOiJwZXRlci5uLm1jYXJ0aHVyQGdvb2dsZW1haWwuY29tIiwiZmlyc3RfbmFtZSI6IlBldGVyIiwibGFzdF9uYW1lIjoiTWNBcnRodXIiLCJvcmdfaWRfdG9fb3JnX21lbWJlcl9pbmZvIjp7IjNhYWFmNzA0LTg5ZGUtNDY4Yy05YjNjLWVhMGIyZmI3YjlkMiI6eyJvcmdfaWQiOiIzYWFhZjcwNC04OWRlLTQ2OGMtOWIzYy1lYTBiMmZiN2I5ZDIiLCJvcmdfbmFtZSI6ImFzZGEiLCJ1cmxfc2FmZV9vcmdfbmFtZSI6ImFzZGEiLCJvcmdfbWV0YWRhdGEiOnt9LCJ1c2VyX3JvbGUiOiJPd25lciIsImluaGVyaXRlZF91c2VyX3JvbGVzX3BsdXNfY3VycmVudF9yb2xlIjpbIk93bmVyIiwiQWRtaW4iLCJNZW1iZXIiXSwib3JnX3JvbGVfc3RydWN0dXJlIjoic2luZ2xlX3JvbGVfaW5faGllcmFyY2h5IiwiYWRkaXRpb25hbF9yb2xlcyI6W10sInVzZXJfcGVybWlzc2lvbnMiOlsicHJvcGVsYXV0aDo6Y2FuX2ludml0ZSIsInByb3BlbGF1dGg6OmNhbl9jaGFuZ2Vfcm9sZXMiLCJwcm9wZWxhdXRoOjpjYW5fcmVtb3ZlX3VzZXJzIiwicHJvcGVsYXV0aDo6Y2FuX3NldHVwX3NhbWwiLCJwcm9wZWxhdXRoOjpjYW5fbWFuYWdlX2FwaV9rZXlzIiwicHJvcGVsYXV0aDo6Y2FuX3VwZGF0ZV9vcmdfbWV0YWRhdGEiLCJwcm9wZWxhdXRoOjpjYW5fdmlld19vdGhlcl9tZW1iZXJzIiwicHJvcGVsYXV0aDo6Y2FuX2RlbGV0ZV9vcmciLCJiaWxsaW5nIl19LCJjMzgxNGM2NS04ZTI5LTQxZTQtODQ1OS0xNzI4NmYwZmRhY2MiOnsib3JnX2lkIjoiYzM4MTRjNjUtOGUyOS00MWU0LTg0NTktMTcyODZmMGZkYWNjIiwib3JnX25hbWUiOiJTcXVhZCBBSSIsInVybF9zYWZlX29yZ19uYW1lIjoic3F1YWQtYWkiLCJvcmdfbWV0YWRhdGEiOnsic3RyaXBlQ3VzdG9tZXJJZCI6ImN1c19RMTVJNTBHOWxBWEVMYSIsImxvZ29VcmwiOiJodHRwczovL2Fzc2V0cy5tZWV0c3F1YWQuYWkvY29tcGFueS1sb2dvcy9zcXVhZC5zdmcifSwidXNlcl9yb2xlIjoiT3duZXIiLCJpbmhlcml0ZWRfdXNlcl9yb2xlc19wbHVzX2N1cnJlbnRfcm9sZSI6WyJPd25lciIsIkFkbWluIiwiTWVtYmVyIl0sIm9yZ19yb2xlX3N0cnVjdHVyZSI6InNpbmdsZV9yb2xlX2luX2hpZXJhcmNoeSIsImFkZGl0aW9uYWxfcm9sZXMiOltdLCJ1c2VyX3Blcm1pc3Npb25zIjpbInByb3BlbGF1dGg6OmNhbl9pbnZpdGUiLCJwcm9wZWxhdXRoOjpjYW5fY2hhbmdlX3JvbGVzIiwicHJvcGVsYXV0aDo6Y2FuX3JlbW92ZV91c2VycyIsInByb3BlbGF1dGg6OmNhbl9zZXR1cF9zYW1sIiwicHJvcGVsYXV0aDo6Y2FuX21hbmFnZV9hcGlfa2V5cyIsInByb3BlbGF1dGg6OmNhbl91cGRhdGVfb3JnX21ldGFkYXRhIiwicHJvcGVsYXV0aDo6Y2FuX3ZpZXdfb3RoZXJfbWVtYmVycyIsInByb3BlbGF1dGg6OmNhbl9kZWxldGVfb3JnIiwiYmlsbGluZyJdfSwiMjBiZGFlMDItZGM4My00YzhhLTg1ZWYtODQ0ZDhhZTYzZmMzIjp7Im9yZ19pZCI6IjIwYmRhZTAyLWRjODMtNGM4YS04NWVmLTg0NGQ4YWU2M2ZjMyIsIm9yZ19uYW1lIjoiZGVsaXZlcm9vIiwidXJsX3NhZmVfb3JnX25hbWUiOiJkZWxpdmVyb28iLCJvcmdfbWV0YWRhdGEiOnt9LCJ1c2VyX3JvbGUiOiJPd25lciIsImluaGVyaXRlZF91c2VyX3JvbGVzX3BsdXNfY3VycmVudF9yb2xlIjpbIk93bmVyIiwiQWRtaW4iLCJNZW1iZXIiXSwib3JnX3JvbGVfc3RydWN0dXJlIjoic2luZ2xlX3JvbGVfaW5faGllcmFyY2h5IiwiYWRkaXRpb25hbF9yb2xlcyI6W10sInVzZXJfcGVybWlzc2lvbnMiOlsicHJvcGVsYXV0aDo6Y2FuX2ludml0ZSIsInByb3BlbGF1dGg6OmNhbl9jaGFuZ2Vfcm9sZXMiLCJwcm9wZWxhdXRoOjpjYW5fcmVtb3ZlX3VzZXJzIiwicHJvcGVsYXV0aDo6Y2FuX3NldHVwX3NhbWwiLCJwcm9wZWxhdXRoOjpjYW5fbWFuYWdlX2FwaV9rZXlzIiwicHJvcGVsYXV0aDo6Y2FuX3VwZGF0ZV9vcmdfbWV0YWRhdGEiLCJwcm9wZWxhdXRoOjpjYW5fdmlld19vdGhlcl9tZW1iZXJzIiwicHJvcGVsYXV0aDo6Y2FuX2RlbGV0ZV9vcmciLCJiaWxsaW5nIl19LCJkZTk3OTMyNy1hZDFmLTQzNDEtYmVlOS1mMTIwMDhjN2RhYzIiOnsib3JnX2lkIjoiZGU5NzkzMjctYWQxZi00MzQxLWJlZTktZjEyMDA4YzdkYWMyIiwib3JnX25hbWUiOiJtaW5lIiwidXJsX3NhZmVfb3JnX25hbWUiOiJtaW5lIiwib3JnX21ldGFkYXRhIjp7fSwidXNlcl9yb2xlIjoiT3duZXIiLCJpbmhlcml0ZWRfdXNlcl9yb2xlc19wbHVzX2N1cnJlbnRfcm9sZSI6WyJPd25lciIsIkFkbWluIiwiTWVtYmVyIl0sIm9yZ19yb2xlX3N0cnVjdHVyZSI6InNpbmdsZV9yb2xlX2luX2hpZXJhcmNoeSIsImFkZGl0aW9uYWxfcm9sZXMiOltdLCJ1c2VyX3Blcm1pc3Npb25zIjpbInByb3BlbGF1dGg6OmNhbl9pbnZpdGUiLCJwcm9wZWxhdXRoOjpjYW5fY2hhbmdlX3JvbGVzIiwicHJvcGVsYXV0aDo6Y2FuX3JlbW92ZV91c2VycyIsInByb3BlbGF1dGg6OmNhbl9zZXR1cF9zYW1sIiwicHJvcGVsYXV0aDo6Y2FuX21hbmFnZV9hcGlfa2V5cyIsInByb3BlbGF1dGg6OmNhbl91cGRhdGVfb3JnX21ldGFkYXRhIiwicHJvcGVsYXV0aDo6Y2FuX3ZpZXdfb3RoZXJfbWVtYmVycyIsInByb3BlbGF1dGg6OmNhbl9kZWxldGVfb3JnIiwiYmlsbGluZyJdfX0sInByb3BlcnRpZXMiOnsibWV0YWRhdGEiOiIiLCJwaWN0dXJlX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tQc3hDNTdCclR3Vlg2aXBibWpqLTZzcGdZYnRpUmprbW1XSzgxM2M2ZU1JN09FQ009czk2LWMifX0.N1q1IeDZ7TZEqDGB8XQQHNm6WhpBhNpBEPSAhXX2HHmEeAfCvV5cJrmJpNRNLoZfbDid3OSoj-F5Ek42J7DB992OQdXVB0QDYfXcb0a2DR6T-Rk70WG-nKWz5YErEaV0pY_7BBj4WJc-RFK6rVcocmhX_UtGsLA1PG_cwiyHX5hBfnMgnrswndeLUdOT3aS3xVxo3WeB3VA08nNXkuGGO6OWaVSMAw4phZ0Gb8X9dcBI56ec404ubq8cGz8vwa9R6gAzcBFcPSMnaGQmuRGIBxe7TbSE7y_TQHC747Bl1bpsT1gk-l4ISaswzb-8UNQuC8xXxhkhYw0cS_RjtyPUnA"

    try {

    const res = await fetch(`https://dev.api.meetsquad.ai/organisations/${orgId}/workspaces/${workspaceId}/opportunities`, {
        method: "POST",
        headers: {
            "authorization": `Bearer ${token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            title,
            description,
            status: "New"
        })
    })
    const body = await res.json();

    return body.data;
} catch (e) {
    console.error("error", e)
    throw e;
}
}