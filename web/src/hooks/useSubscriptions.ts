"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserSubscriptions } from "@/actions/dashboard.actions";
import type { Subscription } from "@/types";

export function useSubscriptions(walletAddress: string | undefined) {
  const [data, setData] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const result = await getUserSubscriptions(walletAddress);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, refetch };
}
