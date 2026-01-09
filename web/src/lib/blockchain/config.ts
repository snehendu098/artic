import { type Chain } from "viem";
import { mantle } from "viem/chains";

// Supported chain
export const SUPPORTED_CHAIN: Chain = mantle;

// Default chain
export const DEFAULT_CHAIN_ID = mantle.id;

// Native token info
export const NATIVE_TOKEN = { symbol: "MNT", name: "Mantle", decimals: 18 };

// Get native token
export function getNativeToken() {
  return NATIVE_TOKEN;
}
