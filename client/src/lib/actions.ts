"use server";

export interface DelegationWallet {
  id: string;
  user: string;
  delegationWalletAddress: string;
  createdAt: string | null;
}

export interface Strategy {
  id: string;
  strategy: string;
  creatorWallet: string | null;
  delegationWallet: string | null;
  isActive: boolean;
  createdAt: string | null;
}

export interface StrategyInfo {
  strategyId: string;
  name: string;
  subscriberCount: number;
  isActiveForUser: boolean;
  isCreator: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export async function fetchDelegationWallets(
  wallet: string
): Promise<DelegationWallet[]> {
  try {
    const url = `${API_BASE_URL}/users/delegations/${encodeURIComponent(wallet)}`;
    console.log("Fetching delegations from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch delegation wallets: ${response.status}`);
    }

    const data: ApiResponse<DelegationWallet[]> = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to fetch delegation wallets");
    }

    console.log("Delegations fetched successfully:", data.data);
    return data.data;
  } catch (error) {
    console.error("Error fetching delegation wallets:", error);
    return [];
  }
}

export async function fetchStrategies(
  creatorWallet: string
): Promise<Strategy[]> {
  try {
    const url = `${API_BASE_URL}/strategies/${encodeURIComponent(creatorWallet)}`;
    console.log("Fetching strategies from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch strategies: ${response.status}`);
    }

    const data: ApiResponse<Strategy[]> = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to fetch strategies");
    }

    console.log("Strategies fetched successfully:", data.data);
    return data.data;
  } catch (error) {
    console.error("Error fetching strategies:", error);
    return [];
  }
}

export async function fetchStrategiesForUser(
  userWallet: string
): Promise<StrategyInfo[]> {
  try {
    const url = `${API_BASE_URL}/user/${encodeURIComponent(userWallet)}/strategies`;
    console.log("Fetching user strategies from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user strategies: ${response.status}`);
    }

    const data: ApiResponse<StrategyInfo[]> = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to fetch user strategies");
    }

    console.log("User strategies fetched successfully:", data.data);
    return data.data;
  } catch (error) {
    console.error("Error fetching user strategies:", error);
    return [];
  }
}

export async function createStrategy(
  name: string,
  strategyContent: string,
  creatorWallet: string,
  isPublic: boolean,
  activate: boolean,
  delegationWallet?: string
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const url = `${API_BASE_URL}/strategies/create`;
    console.log("Creating strategy at:", url);

    const requestBody: any = {
      name,
      strategy: strategyContent,
      creatorWallet,
      isPublic,
      isActive: activate,
    };

    if (activate && delegationWallet) {
      requestBody.delegationWallet = delegationWallet;
    }

    console.log("Request body:", requestBody);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response status:", response.status);

    const data: ApiResponse = await response.json();

    console.log("Response data:", data);

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || "Failed to create strategy",
      };
    }

    console.log("Strategy created successfully!");
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Error creating strategy:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create strategy",
    };
  }
}

export async function createDelegationWallet(
  wallet: string,
  signature: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE_URL}/users/create-delegation`;
    console.log("Creating delegation wallet at:", url);
    console.log("Wallet:", wallet);
    console.log("Signature:", signature.substring(0, 20) + "...");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet,
        signature,
      }),
    });

    console.log("Response status:", response.status);

    const data: ApiResponse = await response.json();

    console.log("Response data:", data);

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || "Failed to create delegation wallet",
      };
    }

    console.log("Delegation wallet created successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error creating delegation wallet:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create delegation wallet",
    };
  }
}
