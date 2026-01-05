import { formatUnits, type Address, erc20Abi } from "viem";
import { getPublicClient } from "./client";
import { getNativeToken } from "./config";
import { getTokenPrices } from "./prices";
import { getTokensByChain } from "./tokens";
import type { AssetResult, WalletAssetsResult, RawAsset, RawWalletBalances } from "./types";

/**
 * Fetch ERC20 balances using multicall
 */
async function getERC20Balances(
  account: Address,
  chainId: number,
): Promise<{ address: Address; symbol: string; name: string; decimals: number; balance: bigint }[]> {
  const publicClient = getPublicClient(chainId);
  const tokens = getTokensByChain(chainId);

  if (tokens.length === 0) return [];

  const balanceCalls = tokens.map((token) => ({
    address: token.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account],
  }));

  const results = await publicClient.multicall({ contracts: balanceCalls });

  return tokens
    .map((token, i) => ({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      balance: (results[i].status === "success" ? results[i].result : BigInt(0)) as bigint,
    }))
    .filter((t) => t.balance > BigInt(0));
}

/**
 * Fetch native + ERC20 balances for an address
 */
export async function getWalletAssets(
  account: Address,
  chainId: number,
): Promise<WalletAssetsResult> {
  const publicClient = getPublicClient(chainId);
  const nativeToken = getNativeToken(chainId);
  const assets: AssetResult[] = [];

  // Fetch native + ERC20 balances in parallel
  const [nativeBalance, erc20Balances] = await Promise.all([
    publicClient.getBalance({ address: account }),
    getERC20Balances(account, chainId),
  ]);

  // Collect symbols for batch price fetch
  const symbols: string[] = [];
  if (nativeBalance > BigInt(0)) symbols.push(nativeToken.symbol);
  erc20Balances.forEach((t) => symbols.push(t.symbol));

  // Fetch prices
  const prices = symbols.length > 0 ? await getTokenPrices(symbols) : {};

  // Add native token if balance > 0
  if (nativeBalance > BigInt(0)) {
    assets.push({
      address: "native",
      symbol: nativeToken.symbol,
      name: nativeToken.name,
      decimals: nativeToken.decimals,
      balance: nativeBalance,
      priceUSD: prices[nativeToken.symbol] ?? 0,
      type: "native",
    });
  }

  // Add ERC20 tokens
  for (const token of erc20Balances) {
    assets.push({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      balance: token.balance,
      priceUSD: prices[token.symbol] ?? 0,
      type: "erc20",
    });
  }

  const totalUSD = assets.reduce((sum, a) => {
    const amount = parseFloat(formatUnits(a.balance, a.decimals));
    return sum + amount * a.priceUSD;
  }, 0);

  return { address: account, chainId, assets, totalUSD };
}

/**
 * Fetch wallet balances without prices (for progressive loading)
 */
export async function getRawWalletBalances(
  account: Address,
  chainId: number,
): Promise<RawWalletBalances> {
  const publicClient = getPublicClient(chainId);
  const nativeToken = getNativeToken(chainId);
  const assets: RawAsset[] = [];

  // Fetch native + ERC20 balances in parallel
  const [nativeBalance, erc20Balances] = await Promise.all([
    publicClient.getBalance({ address: account }),
    getERC20Balances(account, chainId),
  ]);

  const nativeAmount = parseFloat(formatUnits(nativeBalance, nativeToken.decimals));

  if (nativeBalance > BigInt(0)) {
    assets.push({
      symbol: nativeToken.symbol,
      name: nativeToken.name,
      balance: nativeBalance,
      decimals: nativeToken.decimals,
      type: "native",
    });
  }

  // Add ERC20 tokens
  for (const token of erc20Balances) {
    assets.push({
      symbol: token.symbol,
      name: token.name,
      balance: token.balance,
      decimals: token.decimals,
      type: "erc20",
    });
  }

  return {
    address: account,
    nativeAmount,
    assets,
    assetCount: assets.length,
  };
}
