import { Chain, PrivateKeyAccount, Transport, WalletClient } from "viem";

export interface ToolDependencies {
  account: PrivateKeyAccount;
  walletClient: WalletClient<Transport, Chain, PrivateKeyAccount>;
}
