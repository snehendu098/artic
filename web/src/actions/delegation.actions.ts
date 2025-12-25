"use server";

import type { DelegationWallet, ApiResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface CreateDelegationResponse {
  userId: string;
  wallet: string;
  delegation: {
    id: string;
    name: string;
    address: string;
  };
}

export async function createDelegationWallet(
  wallet: string,
  signature: string,
  name: string
): Promise<{ success: boolean; message: string; data: DelegationWallet | null }> {
  try {
    const res = await fetch(`${API_URL}/delegations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, signature, name }),
    });

    const json: ApiResponse<CreateDelegationResponse> = await res.json();

    if (!json.success || !json.data) {
      return { success: false, message: json.message, data: null };
    }

    const mapped: DelegationWallet = {
      id: json.data.delegation.id,
      userId: json.data.userId,
      name: json.data.delegation.name,
      address: json.data.delegation.address,
      createdAt: new Date().toISOString(),
    };

    return { success: true, message: json.message, data: mapped };
  } catch (error) {
    console.error("Create delegation error:", error);
    return { success: false, message: "Failed to create wallet", data: null };
  }
}
