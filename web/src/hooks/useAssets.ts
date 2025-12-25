"use client";

import { useState, useEffect, useCallback } from "react";
import { aggregateBalancesToAssets } from "@/lib/blockchain";
import type { Asset } from "@/types";

export function useAssets(walletAddresses: string[], chainId: number) {
  const [data, setData] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (walletAddresses.length === 0) {
      setData([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const result = await aggregateBalancesToAssets(walletAddresses, chainId);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddresses.join(","), chainId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, refetch };
}
