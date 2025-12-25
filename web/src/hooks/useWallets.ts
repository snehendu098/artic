"use client";

import { useState, useEffect, useCallback } from "react";
import { getDelegationWallets } from "@/actions/dashboard.actions";
import type { DelegationWallet } from "@/types";

export function useWallets(walletAddress: string | undefined) {
  const [data, setData] = useState<DelegationWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const result = await getDelegationWallets(walletAddress);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch wallets:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, refetch };
}
