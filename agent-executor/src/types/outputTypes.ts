import * as z from "zod";

export const OrchestratorOutput = z.object({
  tools: z.array(z.string()),
});

export const MainAgentOutput = z.object({
  finalResponse: z.string(),
});
