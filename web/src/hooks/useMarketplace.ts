"use client";

import { useState, useCallback } from "react";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, encodeFunctionData, type Address, parseEther } from "viem";
import { mantleSepoliaTestnet } from "viem/chains";
import {
  ARTIC_MARKETPLACE_ADDRESS,
  ARTIC_MARKETPLACE_ABI,
  uuidToBytes32,
  waitForTransaction,
} from "@/lib/blockchain";

type TxStatus = "idle" | "pending" | "success" | "error";

interface TxState {
  status: TxStatus;
  hash?: `0x${string}`;
  error?: string;
}

export function useMarketplace() {
  const { wallets } = useWallets();
  const [txState, setTxState] = useState<TxState>({ status: "idle" });

  const getWalletClient = useCallback(async () => {
    const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");
    const wallet = embeddedWallet || wallets[0];

    if (!wallet) {
      throw new Error("No wallet connected");
    }

    const provider = await wallet.getEthereumProvider();
    return createWalletClient({
      chain: mantleSepoliaTestnet,
      transport: custom(provider),
      account: wallet.address as Address,
    });
  }, [wallets]);

  const resetTxState = useCallback(() => {
    setTxState({ status: "idle" });
  }, []);

  // List strategy on marketplace
  const handleListStrategy = useCallback(
    async (strategyId: string, priceMnt: string) => {
      try {
        setTxState({ status: "pending" });
        const walletClient = await getWalletClient();

        const data = encodeFunctionData({
          abi: ARTIC_MARKETPLACE_ABI,
          functionName: "listStrategy",
          args: [uuidToBytes32(strategyId), parseEther(priceMnt)],
        });

        const hash = await walletClient.sendTransaction({
          to: ARTIC_MARKETPLACE_ADDRESS,
          data,
        });

        setTxState({ status: "pending", hash });
        await waitForTransaction(hash);
        setTxState({ status: "success", hash });
        return hash;
      } catch (e) {
        const error = e instanceof Error ? e.message : "Transaction failed";
        setTxState({ status: "error", error });
        throw e;
      }
    },
    [getWalletClient]
  );

  // Update strategy price
  const handleUpdatePrice = useCallback(
    async (strategyId: string, newPriceMnt: string) => {
      try {
        setTxState({ status: "pending" });
        const walletClient = await getWalletClient();

        const data = encodeFunctionData({
          abi: ARTIC_MARKETPLACE_ABI,
          functionName: "updatePrice",
          args: [uuidToBytes32(strategyId), parseEther(newPriceMnt)],
        });

        const hash = await walletClient.sendTransaction({
          to: ARTIC_MARKETPLACE_ADDRESS,
          data,
        });

        setTxState({ status: "pending", hash });
        await waitForTransaction(hash);
        setTxState({ status: "success", hash });
        return hash;
      } catch (e) {
        const error = e instanceof Error ? e.message : "Transaction failed";
        setTxState({ status: "error", error });
        throw e;
      }
    },
    [getWalletClient]
  );

  // Delist strategy
  const handleDelistStrategy = useCallback(
    async (strategyId: string) => {
      try {
        setTxState({ status: "pending" });
        const walletClient = await getWalletClient();

        const data = encodeFunctionData({
          abi: ARTIC_MARKETPLACE_ABI,
          functionName: "delistStrategy",
          args: [uuidToBytes32(strategyId)],
        });

        const hash = await walletClient.sendTransaction({
          to: ARTIC_MARKETPLACE_ADDRESS,
          data,
        });

        setTxState({ status: "pending", hash });
        await waitForTransaction(hash);
        setTxState({ status: "success", hash });
        return hash;
      } catch (e) {
        const error = e instanceof Error ? e.message : "Transaction failed";
        setTxState({ status: "error", error });
        throw e;
      }
    },
    [getWalletClient]
  );

  // Purchase strategy
  const handlePurchaseStrategy = useCallback(
    async (strategyId: string, priceMnt: string) => {
      try {
        setTxState({ status: "pending" });
        const walletClient = await getWalletClient();

        const data = encodeFunctionData({
          abi: ARTIC_MARKETPLACE_ABI,
          functionName: "purchaseStrategy",
          args: [uuidToBytes32(strategyId)],
        });

        const hash = await walletClient.sendTransaction({
          to: ARTIC_MARKETPLACE_ADDRESS,
          data,
          value: parseEther(priceMnt),
        });

        setTxState({ status: "pending", hash });
        await waitForTransaction(hash);
        setTxState({ status: "success", hash });
        return hash;
      } catch (e) {
        const error = e instanceof Error ? e.message : "Transaction failed";
        setTxState({ status: "error", error });
        throw e;
      }
    },
    [getWalletClient]
  );

  // Subscribe to strategy
  const handleSubscribe = useCallback(
    async (strategyId: string, delegationWallet: Address) => {
      try {
        setTxState({ status: "pending" });
        const walletClient = await getWalletClient();

        const data = encodeFunctionData({
          abi: ARTIC_MARKETPLACE_ABI,
          functionName: "subscribe",
          args: [uuidToBytes32(strategyId), delegationWallet],
        });

        const hash = await walletClient.sendTransaction({
          to: ARTIC_MARKETPLACE_ADDRESS,
          data,
        });

        setTxState({ status: "pending", hash });
        await waitForTransaction(hash);
        setTxState({ status: "success", hash });
        return hash;
      } catch (e) {
        const error = e instanceof Error ? e.message : "Transaction failed";
        setTxState({ status: "error", error });
        throw e;
      }
    },
    [getWalletClient]
  );

  // Pause subscription
  const handlePauseSubscription = useCallback(
    async (strategyId: string, delegationWallet: Address) => {
      try {
        setTxState({ status: "pending" });
        const walletClient = await getWalletClient();

        const data = encodeFunctionData({
          abi: ARTIC_MARKETPLACE_ABI,
          functionName: "pauseSubscription",
          args: [uuidToBytes32(strategyId), delegationWallet],
        });

        const hash = await walletClient.sendTransaction({
          to: ARTIC_MARKETPLACE_ADDRESS,
          data,
        });

        setTxState({ status: "pending", hash });
        await waitForTransaction(hash);
        setTxState({ status: "success", hash });
        return hash;
      } catch (e) {
        const error = e instanceof Error ? e.message : "Transaction failed";
        setTxState({ status: "error", error });
        throw e;
      }
    },
    [getWalletClient]
  );

  // Activate subscription
  const handleActivateSubscription = useCallback(
    async (strategyId: string, delegationWallet: Address) => {
      try {
        setTxState({ status: "pending" });
        const walletClient = await getWalletClient();

        const data = encodeFunctionData({
          abi: ARTIC_MARKETPLACE_ABI,
          functionName: "activateSubscription",
          args: [uuidToBytes32(strategyId), delegationWallet],
        });

        const hash = await walletClient.sendTransaction({
          to: ARTIC_MARKETPLACE_ADDRESS,
          data,
        });

        setTxState({ status: "pending", hash });
        await waitForTransaction(hash);
        setTxState({ status: "success", hash });
        return hash;
      } catch (e) {
        const error = e instanceof Error ? e.message : "Transaction failed";
        setTxState({ status: "error", error });
        throw e;
      }
    },
    [getWalletClient]
  );

  // Update subscription wallet
  const handleUpdateSubscriptionWallet = useCallback(
    async (strategyId: string, oldWallet: Address, newWallet: Address) => {
      try {
        setTxState({ status: "pending" });
        const walletClient = await getWalletClient();

        const data = encodeFunctionData({
          abi: ARTIC_MARKETPLACE_ABI,
          functionName: "updateSubscriptionWallet",
          args: [uuidToBytes32(strategyId), oldWallet, newWallet],
        });

        const hash = await walletClient.sendTransaction({
          to: ARTIC_MARKETPLACE_ADDRESS,
          data,
        });

        setTxState({ status: "pending", hash });
        await waitForTransaction(hash);
        setTxState({ status: "success", hash });
        return hash;
      } catch (e) {
        const error = e instanceof Error ? e.message : "Transaction failed";
        setTxState({ status: "error", error });
        throw e;
      }
    },
    [getWalletClient]
  );

  // Withdraw earnings
  const handleWithdrawEarnings = useCallback(async () => {
    try {
      setTxState({ status: "pending" });
      const walletClient = await getWalletClient();

      const data = encodeFunctionData({
        abi: ARTIC_MARKETPLACE_ABI,
        functionName: "withdrawEarnings",
        args: [],
      });

      const hash = await walletClient.sendTransaction({
        to: ARTIC_MARKETPLACE_ADDRESS,
        data,
      });

      setTxState({ status: "pending", hash });
      await waitForTransaction(hash);
      setTxState({ status: "success", hash });
      return hash;
    } catch (e) {
      const error = e instanceof Error ? e.message : "Transaction failed";
      setTxState({ status: "error", error });
      throw e;
    }
  }, [getWalletClient]);

  return {
    txState,
    resetTxState,
    listStrategy: handleListStrategy,
    updatePrice: handleUpdatePrice,
    delistStrategy: handleDelistStrategy,
    purchaseStrategy: handlePurchaseStrategy,
    subscribe: handleSubscribe,
    pauseSubscription: handlePauseSubscription,
    activateSubscription: handleActivateSubscription,
    updateSubscriptionWallet: handleUpdateSubscriptionWallet,
    withdrawEarnings: handleWithdrawEarnings,
  };
}
