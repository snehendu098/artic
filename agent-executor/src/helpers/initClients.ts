import {
  createWalletClient,
  http,
  PrivateKeyAccount,
  publicActions,
} from "viem";
import { mantle, mantleSepoliaTestnet } from "viem/chains";

export const initClients = (account: PrivateKeyAccount) => {
  const walletClient = createWalletClient({
    account,
    chain: mantleSepoliaTestnet,
    transport: http(),
  }).extend(publicActions);

  return { walletClient };
};
