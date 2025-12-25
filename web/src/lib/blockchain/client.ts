import { createPublicClient, http } from "viem";
import { mantleSepoliaTestnet } from "viem/chains";
import { SUPPORTED_CHAINS, DEFAULT_CHAIN_ID } from "./config";

/**
 * Create a public client for a specific chain
 */
export function getPublicClient(chainId: number = DEFAULT_CHAIN_ID) {
  const chain = SUPPORTED_CHAINS[chainId] || mantleSepoliaTestnet;
  return createPublicClient({
    chain,
    transport: http(),
    batch: { multicall: true },
  });
}
