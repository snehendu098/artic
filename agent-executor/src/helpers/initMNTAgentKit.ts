import { MNTAgentKit } from "mantle-agent-kit-sdk";
import { Address } from "viem";

export const initAgentKit = (privateKey: Address): MNTAgentKit => {
  return new MNTAgentKit(privateKey, "testnet-demo");
};
