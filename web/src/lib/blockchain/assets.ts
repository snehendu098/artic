import { formatUnits, type Address } from "viem";
import { getPublicClient } from "./client";
import { getNativeToken } from "./config";
import { getTokenPrice } from "./prices";
import type { AssetResult, WalletAssetsResult, RawAsset, RawWalletBalances } from "./types";

/**
 * Fetch native token balance for an address
 */
export async function getWalletAssets(
  account: Address,
  chainId: number,
): Promise<WalletAssetsResult> {
  const publicClient = getPublicClient(chainId);
  const nativeToken = getNativeToken(chainId);
  const assets: AssetResult[] = [];

  // Fetch native balance
  const nativeBalance = await publicClient.getBalance({ address: account });

  if (nativeBalance > BigInt(0)) {
    // Get price from Pyth
    const price = await getTokenPrice(nativeToken.symbol);

    assets.push({
      address: "native",
      symbol: nativeToken.symbol,
      name: nativeToken.name,
      decimals: nativeToken.decimals,
      balance: nativeBalance,
      priceUSD: price,
      type: "native",
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

  const nativeBalance = await publicClient.getBalance({ address: account });
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

  return {
    address: account,
    nativeAmount,
    assets,
    assetCount: assets.length,
  };
}
