import type { ApiResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export async function api<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const json: ApiResponse<T> = await res.json();

    if (!json.success) {
      console.error(`API error: ${json.message}`);
      return null;
    }

    return json.data;
  } catch (error) {
    console.error("API fetch error:", error);
    return null;
  }
}
