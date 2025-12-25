import { type Chain } from "viem";
import { mantle, mantleSepoliaTestnet } from "viem/chains";

// Supported chains
export const SUPPORTED_CHAINS: Record<number, Chain> = {
  [mantle.id]: mantle,
  [mantleSepoliaTestnet.id]: mantleSepoliaTestnet,
};

// Default chain
export const DEFAULT_CHAIN_ID = mantleSepoliaTestnet.id;

// Native token info per chain
export const NATIVE_TOKENS: Record<number, { symbol: string; name: string; decimals: number }> = {
  [mantle.id]: { symbol: "MNT", name: "Mantle", decimals: 18 },
  [mantleSepoliaTestnet.id]: { symbol: "MNT", name: "Mantle", decimals: 18 },
};

// Get native token for a chain
export function getNativeToken(chainId: number) {
  return NATIVE_TOKENS[chainId] || NATIVE_TOKENS[DEFAULT_CHAIN_ID];
}
