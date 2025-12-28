import { Chain, PrivateKeyAccount, Transport, WalletClient } from "viem";
import { EventLogger } from "../helpers/EventLogger";

export interface ToolDependencies {
  account: PrivateKeyAccount;
  walletClient: WalletClient<Transport, Chain, PrivateKeyAccount>;
  eventLogger: EventLogger;
}
