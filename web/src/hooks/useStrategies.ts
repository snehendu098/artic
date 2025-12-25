"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserStrategies } from "@/actions/dashboard.actions";
import type { Strategy } from "@/types";

export function useStrategies(walletAddress: string | undefined) {
  const [data, setData] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const result = await getUserStrategies(walletAddress);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch strategies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, refetch };
}
