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
import { OrchestratorOutput } from "../types";
import { EventLogger } from "../helpers/EventLogger";
import { ChatGroq } from "@langchain/groq";

export class Agent {
  public account: PrivateKeyAccount;
  public walletClient: WalletClient<Transport, Chain, PrivateKeyAccount>;
  public model: ChatGroq;
  private deps: ToolDependencies;
  private eventLogger: EventLogger;

  constructor(pk: Address, apiKey: string, eventLogger: EventLogger) {
    this.account = initAccount(pk);
    const { walletClient } = initClients(this.account);
    this.walletClient = walletClient;
    this.eventLogger = eventLogger;
    this.deps = {
      account: this.account,
      walletClient: this.walletClient,
      eventLogger: this.eventLogger,
    };

    this.model = new ChatGroq({
      model: "openai/gpt-oss-120b",
      apiKey,
    });
  }

  async messageAgent(strategy: string, actions: string, toolNames: string[]) {
    try {
      const allTools = getAllTools(this.deps);
      const tools = filterToolsByNames(allTools, toolNames);

      const systemPrompt = `
You are agent Artic: An agent specialized in doing blockchain interactions in the mantle network. Your task is to analyze a strategy and with the given tools that you have access to you will execute the steps in the strategy by correctly analyzing the strategy

Your INPUTS:

STRATEGY: The main strategy which you have to execute with a given set of tools
TOOLS: A list of tools with metadata of each which will include the name, parameters to invoke that tools
PREVIOUS ACTIONS WITH NOTES: A set of previous actions that has been implemented for execution that strategy with their corresponding notes which indicate any additional information about the executed action

IMPORTANT NOTES:
- Strategies will be in plaintext
- Be extremely concise but accurate in your final response
- If the strategy doesn't make sense or the strategy is not something that can be executed, just simply ignore it and return a blank response

STRATEGY FORMAT:
In the strategy the user will state what the user's intent is, from the available tools, you'll have to understand the users intent properly and execute the strategy according to the order that user has mentioned
`;

      const toolInputs = tools
        .map(
          (item) => `
Name: ${item.name}
Description: ${item.description}
`,
        )
        .join("\n\n");

      const prompt = `
STRATEGY: ${strategy}

TOOLS:
${toolInputs}

PREVIOUS ACTIONS WITH NOTES:
${actions}
`;

      const mainAgent = createAgent({
        model: this.model,
        tools,
      });

      const result = await mainAgent.invoke({
        messages: [new SystemMessage(systemPrompt), new HumanMessage(prompt)],
      });

      return result;
    } catch (err: any) {
      console.log(err);
      return err;
    }
  }

  async execute(strategy: string, actions: string) {
    try {
      await this.eventLogger.emit({
        type: "orchestrating",
        data: { note: "Analyzing strategy and selecting tools" },
      });

      const { toolNames } = await this.orchestrate(strategy);

      await this.eventLogger.emit({
        type: "tools_selected",
        data: {
          tools: toolNames,
          note: `Selected ${toolNames.length} tool(s)`,
        },
      });

      const result = await this.messageAgent(strategy, actions, toolNames);

      await this.eventLogger.emit({
        type: "completed",
        data: { note: "Strategy execution completed" },
      });

      return result;
    } catch (err: any) {
      console.log("execute error:", err);
      throw err;
    }
  }

  async orchestrate(strategy: string) {
    try {
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
    } catch (err: any) {
      console.log("orchestrate error:", err);
      throw err;
    }
  }
}
