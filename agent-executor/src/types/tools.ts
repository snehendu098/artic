import { Chain, PrivateKeyAccount, Transport, WalletClient } from "viem";
import { EventLogger } from "../helpers/EventLogger";
import { MNTAgentKit } from "mantle-agent-kit-sdk";

export interface ToolDependencies {
  account: PrivateKeyAccount;
  walletClient: WalletClient<Transport, Chain, PrivateKeyAccount>;
  eventLogger: EventLogger;
  mntAgentKit: MNTAgentKit;
}
