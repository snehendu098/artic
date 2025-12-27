import { Address, PrivateKeyAccount } from "viem";
import { initAccount } from "../helpers/initAccount";
import { getAllTools } from "../helpers/getAllTools";

export class Agent {
  public account: PrivateKeyAccount;

  constructor(pk: Address) {
    this.account = initAccount(pk);
  }

  messageAgent() {
    // 1. setup system prompt
    const systemPrompt = `
You are agent Artic: An agent specialized in doing blockchain interactions in the mantle network. Your task s to analyze a strategy and with the given tools that you have access to you will execute the steps in the strategy by correctly analyzing the strategy

Your INPUTS:

strategy: {strategy}
tools: A list of tools with metadata of each which will include the name, parameters to invoke that tools

IMPORTANT NOTES:
- Strategies will be in plaintext
- Be extremely concise but accurate in your final response
`;

    const tools = getAllTools(this.account);

    // 2. Pass it down to the orchestrator to filter out the tools with previous actions and notes
    // 3. Send run the run function to invoke the new agent with a system prompt
  }

  orchestrate() {
    // 1. Instance of the agent kit as param, use react agent to filter out tools
    // 2. Load the tools
  }
}
