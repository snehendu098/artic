import { formatUnits, type Address } from "viem";
import { mantleSepoliaTestnet } from "viem/chains";
import { getWalletAssets } from "./assets";
import { getTokenPrices } from "./prices";
import { getNativeToken } from "./config";
import type { WalletBalance } from "./types";
import type { Asset, Wallet } from "@/types";

/**
 * Fetch wallet balances for multiple addresses
 */
export async function getWalletBalances(
  addresses: string[],
  chainId: number = mantleSepoliaTestnet.id,
): Promise<WalletBalance[]> {
  const results: WalletBalance[] = [];

  for (const address of addresses) {
    const walletAssets = await getWalletAssets(address as Address, chainId);

    const nativeAsset = walletAssets.assets.find((a) => a.type === "native");
    const tokenAssets = walletAssets.assets.filter((a) => a.type === "erc20");

    results.push({
      address,
      mntBalance: nativeAsset?.balance ?? BigInt(0),
      tokenBalances: tokenAssets.map((t) => ({
        symbol: t.symbol,
        name: t.name,
        balance: t.balance,
        decimals: t.decimals,
      })),
    });
  }

  return results;
}

/**
 * Aggregate balances into Asset format for CombinedAssetCard
 */
export async function aggregateBalancesToAssets(
  walletAddresses: string[],
  chainId: number = mantleSepoliaTestnet.id,
): Promise<Asset[]> {
  const assetMap = new Map<string, Asset>();

  for (const address of walletAddresses) {
    const walletAssets = await getWalletAssets(address as Address, chainId);

    for (const asset of walletAssets.assets) {
      const amount = formatUnits(asset.balance, asset.decimals);
      const amountNum = parseFloat(amount);
      const usdValue = amountNum * asset.priceUSD;

      const existing = assetMap.get(asset.symbol);
      if (existing) {
        existing.valueUSD += usdValue;
        existing.wallets.push({ address, amount });
      } else {
        assetMap.set(asset.symbol, {
          id: asset.symbol.toLowerCase(),
          symbol: asset.symbol,
          name: asset.name,
          valueUSD: usdValue,
          wallets: [{ address, amount }],
          change24h: 0,
        });
      }
    }
  }

  return Array.from(assetMap.values());
}

/**
 * Transform wallet balance into Wallet type format
 */
export async function transformWalletBalance(
  delegation: { id: string; name: string; address: string },
  balance: WalletBalance,
  chainId: number = mantleSepoliaTestnet.id,
): Promise<Wallet> {
  const nativeToken = getNativeToken(chainId);
  const symbols = [nativeToken.symbol, ...balance.tokenBalances.map((t) => t.symbol)];
  const prices = await getTokenPrices(symbols);

  const assets: Wallet["assets"] = [];
  const mntPrice = prices[nativeToken.symbol] ?? 0;

  const mntAmount = parseFloat(formatUnits(balance.mntBalance, 18));
  if (mntAmount > 0) {
    assets.push({
      id: nativeToken.symbol.toLowerCase(),
      symbol: nativeToken.symbol,
      name: nativeToken.name,
      value: mntAmount,
      valueUSD: mntAmount * mntPrice,
      change24h: 0,
    });
  }

  for (const token of balance.tokenBalances) {
    const amount = parseFloat(formatUnits(token.balance, token.decimals));
    if (amount > 0) {
      const price = prices[token.symbol] ?? 0;
      assets.push({
        id: token.symbol.toLowerCase(),
        symbol: token.symbol,
        name: token.name,
        value: amount,
        valueUSD: amount * price,
        change24h: 0,
      });
    }
  }

  const totalUSD = assets.reduce((sum, a) => sum + a.valueUSD, 0);

  return {
    id: delegation.id,
    name: delegation.name,
    address: delegation.address,
    balance: mntAmount,
    balanceUSD: totalUSD,
    assets,
  };
}
