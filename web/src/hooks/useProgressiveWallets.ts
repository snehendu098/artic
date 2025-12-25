"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getDelegationWallets } from "@/actions/dashboard.actions";
import { getRawWalletBalances, getTokenPrices, DEFAULT_CHAIN_ID } from "@/lib/blockchain";
import type { ProgressiveWallet, Wallet } from "@/types";
import type { Address } from "viem";
import { formatUnits } from "viem";

export type LoadingPhase = "idle" | "wallets" | "balances" | "prices" | "complete";

export function useProgressiveWallets(walletAddress: string | undefined) {
  const [wallets, setWallets] = useState<ProgressiveWallet[]>([]);
  const [phase, setPhase] = useState<LoadingPhase>("idle");
  const fetchedRef = useRef(false);

  const refetch = useCallback(async () => {
    if (!walletAddress) {
      setPhase("complete");
      return;
    }

    fetchedRef.current = true;
    setPhase("wallets");

    // Phase 1: Fetch delegation wallets from DB
    const delegations = await getDelegationWallets(walletAddress);

    if (delegations.length === 0) {
      setWallets([]);
      setPhase("complete");
      return;
    }

    // Show wallets immediately with initial loading state
    const initialWallets: ProgressiveWallet[] = delegations.map((d) => ({
      id: d.id,
      name: d.name,
      address: d.address,
      loadingState: "initial",
    }));
    setWallets(initialWallets);
    setPhase("balances");

    // Phase 2: Fetch balances (parallel for all wallets)
    const balanceResults = await Promise.all(
      delegations.map(async (d) => {
        try {
          const raw = await getRawWalletBalances(d.address as Address, DEFAULT_CHAIN_ID);
          return raw;
        } catch {
          return { address: d.address, nativeAmount: 0, assets: [], assetCount: 0 };
        }
      })
    );

    // Update wallets with balance data
    const walletsWithBalances: ProgressiveWallet[] = delegations.map((d) => {
      const balance = balanceResults.find((b) => b.address === d.address);
      return {
        id: d.id,
        name: d.name,
        address: d.address,
        loadingState: "balances" as const,
        balance: balance?.nativeAmount ?? 0,
        assets: balance?.assets.map((a) => ({
          id: a.symbol.toLowerCase(),
          symbol: a.symbol,
          name: a.name,
          value: parseFloat(formatUnits(a.balance, a.decimals)),
          valueUSD: 0,
          change24h: 0,
        })),
      };
    });
    setWallets(walletsWithBalances);
    setPhase("prices");

    // Phase 3: Fetch prices
    const symbols = [...new Set(balanceResults.flatMap((b) => b.assets.map((a) => a.symbol)))];
    const prices = symbols.length > 0 ? await getTokenPrices(symbols) : {};

    // Update with USD values
    const completeWallets: ProgressiveWallet[] = walletsWithBalances.map((w) => {
      const assets: Wallet["assets"] = (w.assets ?? []).map((a) => ({
        ...a,
        valueUSD: a.value * (prices[a.symbol] ?? 0),
      }));
      const balanceUSD = assets.reduce((sum, a) => sum + a.valueUSD, 0);

      return {
        ...w,
        loadingState: "complete" as const,
        assets,
        balanceUSD,
      };
    });
    setWallets(completeWallets);
    setPhase("complete");
  }, [walletAddress]);

  useEffect(() => {
    if (!fetchedRef.current) {
      refetch();
    }
  }, [refetch]);

  return { wallets, phase, refetch };
}
