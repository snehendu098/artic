import { PROTOCOL_METADATA } from "../constants";

export const getToolMetadata = (toolName: string) => {
  const [protocol] = toolName.split("_");
  const meta = PROTOCOL_METADATA[protocol];

  if (!meta) {
    throw new Error(`Protocol not found for tool: ${toolName}`);
  }

  const toolMeta = meta.tools.find((t) => t.name === toolName);

  if (!toolMeta) {
    throw new Error(`Tool metadata not found: ${toolName}`);
  }

  return toolMeta;
};
