import {
  createPublicClient,
  createWalletClient,
  http,
  PrivateKeyAccount,
  publicActions,
} from "viem";
import { mantle } from "viem/chains";

export const initClients = (account: PrivateKeyAccount) => {
  const walletClient = createWalletClient({
    account,
    chain: mantle,
    transport: http(),
  }).extend(publicActions);

  return { walletClient };
};
