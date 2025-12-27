import {
  Address,
  Chain,
  PrivateKeyAccount,
  Transport,
  WalletClient,
} from "viem";
import { initAccount } from "../helpers/initAccount";
import { initClients } from "../helpers/initClients";
import {
  filterToolsByNames,
  getAllTools,
  getToolNames,
} from "../helpers/getAllTools";
import { ToolDependencies } from "../types/tools";
import {
  createAgent,
  HumanMessage,
  providerStrategy,
  SystemMessage,
} from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { OrchestratorOutput } from "../types";

export class Agent {
  public account: PrivateKeyAccount;
  public walletClient: WalletClient<Transport, Chain, PrivateKeyAccount>;
  public model: ChatGoogleGenerativeAI;
  private deps: ToolDependencies;

  constructor(pk: Address, apiKey: string) {
    this.account = initAccount(pk);
    const { walletClient } = initClients(this.account);
    this.walletClient = walletClient;
    this.deps = {
      account: this.account,
      walletClient: this.walletClient,
    };

    this.model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash-lite",
      apiKey,
    });
  }

  async messageAgent(strategy: string, toolNames: string[]) {
    const allTools = getAllTools(this.deps);
    const tools = filterToolsByNames(allTools, toolNames);

    const systemPrompt = `
You are agent Artic: An agent specialized in doing blockchain interactions in the mantle network. Your task is to analyze a strategy and with the given tools that you have access to you will execute the steps in the strategy by correctly analyzing the strategy

Your INPUTS:

strategy: The main strategy which you have to execute with a given set of tools
tools: A list of tools with metadata of each which will include the name, parameters to invoke that tools
actions: A set of previous actions that has been implemented for execution that strategy with their corresponding time stamp

IMPORTANT NOTES:
- Strategies will be in plaintext
- Be extremely concise but accurate in your final response
`;

    // TODO: invoke agent with filtered tools
    return { tools, systemPrompt };
  }

  async execute(strategy: string) {
    const { toolNames } = await this.orchestrate(strategy);
    return this.messageAgent(strategy, toolNames);
  }

  async orchestrate(strategy: string) {
    const allTools = getAllTools(this.deps);
    const validNames = getToolNames(allTools);

    const systemPrompt = `
You are Artic Orchestrator, an AI assistant specialized in analyzing a strategy for blockchain operations

Your Task:
Analyse the strategy of the user and return the appropriate tools as a **JSON array of strings**

Rules:
- Only return a list of tools names
- Only return tools from the available list

Input:
- Your will be given a list of tools and a strategy
`;

    const toolInputs = allTools
      .map(
        (item) => `
Name: ${item.name}
Description: ${item.description}
`,
      )
      .join("\n\n");

    const orchestratorInput = `
Available tools: ${validNames.join(", ")}

Tools:
${toolInputs}

-------------
Strategy:
${strategy}
`;

    const orchestrator = createAgent({
      model: this.model,
      tools: [],
      responseFormat: providerStrategy(OrchestratorOutput),
    });

    const result = await orchestrator.invoke({
      messages: [
        new SystemMessage(systemPrompt),
        new HumanMessage(orchestratorInput),
      ],
    });

    // Runtime validate with zod
    const parsed = OrchestratorOutput.parse(result.structuredResponse);
    return { toolNames: parsed.tools };
  }
}
