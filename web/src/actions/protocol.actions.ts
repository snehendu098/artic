"use server";

interface Tool {
  name: string;
  description: string;
}

interface Protocol {
  name: string;
  description: string;
  tools: Tool[];
}

export async function getProtocols(): Promise<Protocol[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AGENT_EXECUTOR_URL}/protocols/list`,
    );
    const json = await res.json();
    return json.data?.protocols || [];
  } catch (error) {
    console.error("Failed to fetch protocols:", error);
    return [];
  }
}
