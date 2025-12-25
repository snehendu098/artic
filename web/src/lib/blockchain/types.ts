import type { Address } from "viem";

export interface AssetResult {
  address: Address | "native";
  symbol: string;
  name: string;
  decimals: number;
  balance: bigint;
  priceUSD: number;
  type: "native" | "erc20" | "erc721" | string;
}

export interface WalletAssetsResult {
  address: string;
  chainId: number;
  assets: AssetResult[];
  totalUSD: number;
}

export interface WalletBalance {
  address: string;
  mntBalance: bigint;
  tokenBalances: {
    symbol: string;
    name: string;
    balance: bigint;
    decimals: number;
  }[];
}

export interface RawAsset {
  symbol: string;
  name: string;
  balance: bigint;
  decimals: number;
  type: "native" | "erc20";
}

export interface RawWalletBalances {
  address: string;
  nativeAmount: number;
  assets: RawAsset[];
  assetCount: number;
}
