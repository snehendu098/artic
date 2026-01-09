import { createPublicClient, http } from "viem";
import { SUPPORTED_CHAIN } from "./config";

/**
 * Create a public client for Mantle
 */
export function getPublicClient() {
  return createPublicClient({
    chain: SUPPORTED_CHAIN,
    transport: http(),
    batch: { multicall: true },
  });
}
