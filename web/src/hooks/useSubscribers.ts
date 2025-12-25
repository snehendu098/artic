"use client";

import { useState, useEffect, useCallback } from "react";
import { getSubscribers } from "@/actions/dashboard.actions";
import type { Subscriber } from "@/types";

export function useSubscribers(walletAddress: string | undefined) {
  const [data, setData] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const result = await getSubscribers(walletAddress);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, refetch };
}
