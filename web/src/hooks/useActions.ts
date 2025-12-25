"use client";

import { useState, useEffect, useCallback } from "react";
import { getWalletActions } from "@/actions/dashboard.actions";
import type { Action } from "@/types";

export function useActions(walletAddress: string | undefined, limit: number = 10) {
  const [data, setData] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const result = await getWalletActions(walletAddress, limit);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch actions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, limit]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, refetch };
}
