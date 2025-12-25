"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserPurchases, type Purchase } from "@/actions/marketplace.actions";

export function usePurchases(walletAddress: string | undefined) {
  const [data, setData] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const result = await getUserPurchases(walletAddress);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, refetch };
}
