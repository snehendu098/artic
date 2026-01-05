import { tool } from "langchain";
import { ToolDependencies } from "../../types";
import z from "zod";
import { Address } from "viem";

export const createCrossChainSwapTool = (deps: ToolDependencies) => {
  return tool(
    async ({ fromToken, toToken, fromChain, toChain, amount, slippage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: {
          tool: "cross_chain_swap",
          args: { fromToken, toToken, fromChain, toChain, amount, slippage },
        },
      });

      try {
        const txHash = await mntAgentKit.crossChainSwapViaSquid(
          fromToken as Address,
          toToken as Address,
          fromChain,
          toChain,
          amount,
          slippage
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "cross_chain_swap",
            result: `Cross-chain swap ${amount} from chain ${fromChain} to chain ${toChain}`,
            note: `txHash: ${txHash}`,
          },
        });

        return { success: true, txHash };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "cross_chain_swap",
            result: `Cross-chain swap failed: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "cross_chain_swap",
      description:
        "Cross-chain swap via Squid Router. Swap tokens from one chain to another. Mantle chainId=5000, Ethereum=1, Arbitrum=42161, etc.",
      schema: z.object({
        fromToken: z.string().describe("Source token address"),
        toToken: z.string().describe("Destination token address"),
        fromChain: z.number().describe("Source chain ID (e.g. 5000 for Mantle)"),
        toChain: z.number().describe("Destination chain ID (e.g. 1 for Ethereum)"),
        amount: z.string().describe("Amount to swap (human readable)"),
        slippage: z.number().optional().describe("Slippage percentage (default 1)"),
      }),
    }
  );
};
