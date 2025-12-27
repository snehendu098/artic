import { StructuredToolInterface } from "@langchain/core/tools";
import { ToolDependencies } from "../types/tools";
import { createSendTransactionTool } from "../tools";

export const getAllTools = (deps: ToolDependencies) => {
  return [createSendTransactionTool(deps)];
};

export const buildToolMap = (tools: StructuredToolInterface[]) => {
  return new Map(tools.map((t) => [t.name, t]));
};

export const filterToolsByNames = (
  tools: StructuredToolInterface[],
  names: string[],
) => {
  const toolMap = buildToolMap(tools);
  return names
    .map((name) => toolMap.get(name))
    .filter((t): t is StructuredToolInterface => t !== undefined);
};

export const getToolNames = (tools: StructuredToolInterface[]) => {
  return tools.map((t) => t.name);
};
