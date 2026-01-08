import { tool } from "langchain";
import { ToolDependencies } from "../../../types";
import z from "zod";
import { getToolMetadata } from "../../../helpers/getToolMetadata";

export const createOneinchGetQuote = (deps: ToolDependencies) => {
  const meta = getToolMetadata("oneinch_get_quote");
  return tool(
    async ({ fromToken, toToken, amount }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tools_selected",
        data: {
          tool: "oneinch_get_quote",
          args: { fromToken, toToken, amount },
        },
      });

      try {
        const quote = await mntAgentKit.get1inchQuote(
          fromToken,
          toToken,
          amount,
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "oneinch_get_quote",
            result: `Fetched 1inch swap quote from ${fromToken} to ${toToken} for ${amount}`,
          },
        });

        return quote;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "oneinch_get_quote",
            error: `Failed to get 1inch quote: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        fromToken: z
          .string()
          .describe("Address of the token to swap from"),
        toToken: z
          .string()
          .describe("Address of the token to swap to"),
        amount: z
          .string()
          .describe(
            "Amount of tokens to swap. Human readable: e.g: 0.01, 10, 100 etc",
          ),
      }),
    },
  );
};

export const createOneinchSwap = (deps: ToolDependencies) => {
  const meta = getToolMetadata("oneinch_swap");
  return tool(
    async ({ fromToken, toToken, amount, slippage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tools_selected",
        data: {
          tool: "oneinch_swap",
          args: { fromToken, toToken, amount, slippage },
        },
      });

      try {
        const txHash = await mntAgentKit.swapOn1inch(
          fromToken,
          toToken,
          amount,
          slippage,
        );

        const receipt = await mntAgentKit.client.waitForTransactionReceipt({
          hash: txHash,
        });

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "oneinch_swap",
            result: `Swapped ${amount} tokens from ${fromToken} to ${toToken} via 1inch. TxHash: ${txHash}`,
            txHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber.toString(),
          },
        });

        return receipt;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "oneinch_swap",
            error: `Failed to execute 1inch swap: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        fromToken: z
          .string()
          .describe("Address of the token to swap from"),
        toToken: z
          .string()
          .describe("Address of the token to swap to"),
        amount: z
          .string()
          .describe(
            "Amount of tokens to swap. Human readable: e.g: 0.01, 10, 100 etc",
          ),
        slippage: z
          .number()
          .optional()
          .describe("Slippage tolerance percentage (default: 0.5)"),
      }),
    },
  );
};
