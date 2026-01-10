import { formatUnits, type Address, erc20Abi, getAddress } from "viem";
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
  const publicClient = getPublicClient();
  const tokens = getTokensByChain(chainId);
  const checksummedAccount = getAddress(account);

  console.log(`[getERC20Balances] Fetching for account: ${checksummedAccount}, chainId: ${chainId}`);
  console.log(`[getERC20Balances] Tokens to check:`, tokens.map(t => t.symbol));

  if (tokens.length === 0) return [];

  const balanceCalls = tokens.map((token) => ({
    address: getAddress(token.address),
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [checksummedAccount],
  }));

  const results = await publicClient.multicall({ contracts: balanceCalls });

  // Log all results including failures and zero balances
  tokens.forEach((token, i) => {
    const result = results[i];
    if (result.status === "success") {
      console.log(`[getERC20Balances] ${token.symbol} (${token.address}): ${result.result?.toString() ?? "0"}`);
    } else {
      console.log(`[getERC20Balances] ${token.symbol} (${token.address}): FAILED -`, result.error);
    }
  });

  const balances = tokens
    .map((token, i) => ({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      balance: (results[i].status === "success" ? results[i].result : BigInt(0)) as bigint,
    }))
    .filter((t) => t.balance > BigInt(0));

  console.log(`[getERC20Balances] Tokens with balance > 0:`, balances.map(t => `${t.symbol}: ${t.balance.toString()}`));

  return balances;
}

/**
 * Fetch native + ERC20 balances for an address
 */
export async function getWalletAssets(
  account: Address,
  chainId: number,
): Promise<WalletAssetsResult> {
  const publicClient = getPublicClient();
  const nativeToken = getNativeToken();
  const assets: AssetResult[] = [];
  const checksummedAccount = getAddress(account);

  // Fetch native + ERC20 balances in parallel
  const [nativeBalance, erc20Balances] = await Promise.all([
    publicClient.getBalance({ address: checksummedAccount }),
    getERC20Balances(checksummedAccount, chainId),
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

  return { address: checksummedAccount, chainId, assets, totalUSD };
}

/**
 * Fetch wallet balances without prices (for progressive loading)
 */
export async function getRawWalletBalances(
  account: Address,
  chainId: number,
): Promise<RawWalletBalances> {
  const publicClient = getPublicClient();
  const nativeToken = getNativeToken();
  const assets: RawAsset[] = [];
  const checksummedAccount = getAddress(account);

  // Fetch native + ERC20 balances in parallel
  const [nativeBalance, erc20Balances] = await Promise.all([
    publicClient.getBalance({ address: checksummedAccount }),
    getERC20Balances(checksummedAccount, chainId),
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
    address: checksummedAccount,
    nativeAmount,
    assets,
    assetCount: assets.length,
  };
}
