import { parseEther, formatEther, type Address } from "viem";
import { getPublicClient } from "./client";
import {
  ARTIC_MARKETPLACE_ADDRESS,
  ARTIC_MARKETPLACE_ABI,
  uuidToBytes32,
} from "./contract";
import { DEFAULT_CHAIN_ID } from "./config";

// =============================================================================
// READ FUNCTIONS
// =============================================================================

/**
 * Get listing details for a strategy
 */
export async function getListing(
  strategyId: string,
  chainId = DEFAULT_CHAIN_ID,
) {
  const client = getPublicClient();
  const strategyBytes = uuidToBytes32(strategyId);

  const [creator, priceMnt, isActive] = await client.readContract({
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "getListing",
    args: [strategyBytes],
  });

  return {
    creator,
    priceMnt: formatEther(priceMnt),
    priceWei: priceMnt,
    isActive,
  };
}

/**
 * Check if a buyer has purchased a strategy
 */
export async function hasPurchased(
  strategyId: string,
  buyerAddress: Address,
  chainId = DEFAULT_CHAIN_ID,
) {
  const client = getPublicClient();
  const strategyBytes = uuidToBytes32(strategyId);

  return client.readContract({
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "hasPurchased",
    args: [strategyBytes, buyerAddress],
  });
}

/**
 * Get subscriber count for a strategy
 */
export async function getSubscriberCount(
  strategyId: string,
  chainId = DEFAULT_CHAIN_ID,
) {
  const client = getPublicClient();
  const strategyBytes = uuidToBytes32(strategyId);

  const count = await client.readContract({
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "getSubscriberCount",
    args: [strategyBytes],
  });

  return Number(count);
}

/**
 * Check if a wallet is actively subscribed to a strategy
 */
export async function isSubscribed(
  strategyId: string,
  delegationWallet: Address,
  chainId = DEFAULT_CHAIN_ID,
) {
  const client = getPublicClient();
  const strategyBytes = uuidToBytes32(strategyId);

  return client.readContract({
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "isSubscribed",
    args: [strategyBytes, delegationWallet],
  });
}

/**
 * Get subscription details
 */
export async function getSubscription(
  strategyId: string,
  delegationWallet: Address,
  chainId = DEFAULT_CHAIN_ID,
) {
  const client = getPublicClient();
  const strategyBytes = uuidToBytes32(strategyId);

  const [owner, isActive, subscribedAt, pausedAt] = await client.readContract({
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "getSubscription",
    args: [strategyBytes, delegationWallet],
  });

  return {
    owner,
    isActive,
    subscribedAt: Number(subscribedAt) * 1000, // Convert to ms
    pausedAt: Number(pausedAt) * 1000,
  };
}

/**
 * Get all delegation wallets a user has subscribed to a strategy
 */
export async function getUserSubscriptions(
  strategyId: string,
  ownerAddress: Address,
  chainId = DEFAULT_CHAIN_ID,
) {
  const client = getPublicClient();
  const strategyBytes = uuidToBytes32(strategyId);

  return client.readContract({
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "getUserSubscriptions",
    args: [strategyBytes, ownerAddress],
  });
}

/**
 * Get creator balance available for withdrawal
 */
export async function getCreatorBalance(
  creatorAddress: Address,
  chainId = DEFAULT_CHAIN_ID,
) {
  const client = getPublicClient();

  const balance = await client.readContract({
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "creatorBalances",
    args: [creatorAddress],
  });

  return {
    balanceWei: balance,
    balanceMnt: formatEther(balance),
  };
}

// =============================================================================
// WRITE FUNCTION ARGS (for use with sendTransaction)
// =============================================================================

export function getListStrategyArgs(strategyId: string, priceMnt: string) {
  return {
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "listStrategy" as const,
    args: [uuidToBytes32(strategyId), parseEther(priceMnt)] as const,
  };
}

export function getUpdatePriceArgs(strategyId: string, newPriceMnt: string) {
  return {
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "updatePrice" as const,
    args: [uuidToBytes32(strategyId), parseEther(newPriceMnt)] as const,
  };
}

export function getDelistStrategyArgs(strategyId: string) {
  return {
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "delistStrategy" as const,
    args: [uuidToBytes32(strategyId)] as const,
  };
}

export function getPurchaseStrategyArgs(strategyId: string, priceMnt: string) {
  return {
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "purchaseStrategy" as const,
    args: [uuidToBytes32(strategyId)] as const,
    value: parseEther(priceMnt),
  };
}

export function getSubscribeArgs(
  strategyId: string,
  delegationWallet: Address,
) {
  return {
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "subscribe" as const,
    args: [uuidToBytes32(strategyId), delegationWallet] as const,
  };
}

export function getPauseSubscriptionArgs(
  strategyId: string,
  delegationWallet: Address,
) {
  return {
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "pauseSubscription" as const,
    args: [uuidToBytes32(strategyId), delegationWallet] as const,
  };
}

export function getActivateSubscriptionArgs(
  strategyId: string,
  delegationWallet: Address,
) {
  return {
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "activateSubscription" as const,
    args: [uuidToBytes32(strategyId), delegationWallet] as const,
  };
}

export function getUpdateSubscriptionWalletArgs(
  strategyId: string,
  oldWallet: Address,
  newWallet: Address,
) {
  return {
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "updateSubscriptionWallet" as const,
    args: [uuidToBytes32(strategyId), oldWallet, newWallet] as const,
  };
}

export function getWithdrawEarningsArgs() {
  return {
    address: ARTIC_MARKETPLACE_ADDRESS,
    abi: ARTIC_MARKETPLACE_ABI,
    functionName: "withdrawEarnings" as const,
    args: [] as const,
  };
}

// =============================================================================
// UTILITY
// =============================================================================

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  hash: `0x${string}`,
  chainId = DEFAULT_CHAIN_ID,
) {
  const client = getPublicClient();
  return await client.waitForTransactionReceipt({ hash });
}
