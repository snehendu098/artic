import { PROTOCOL_METADATA } from "../constants";

interface ToolMetadata {
  name: string;
  description: string;
}

interface ProtocolInfo {
  name: string;
  description: string;
  tools: ToolMetadata[];
}

export const buildProtocolsList = (): ProtocolInfo[] => {
  return Object.entries(PROTOCOL_METADATA)
    .map(([key, meta]) => ({
      name: meta.name,
      description: meta.description,
      tools: meta.tools.map((t) => ({
        name: t.name,
        description: t.shortDesc,
      })),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};
