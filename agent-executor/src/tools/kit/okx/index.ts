import { tool } from "langchain";
import { ToolDependencies } from "../../../types";
import z from "zod";
import { getToolMetadata } from "../../../helpers/getToolMetadata";

export const createGetSwapQuote = (deps: ToolDependencies) => {
  const meta = getToolMetadata("okx_get_swap_quote");
  return tool(
    async ({ fromTokenAddress, toTokenAddress, amount, slippagePercentage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tools_selected",
        data: {
          tool: "okx_get_swap_quote",
          args: { fromTokenAddress, toTokenAddress, amount, slippagePercentage },
        },
      });

      try {
        const quote = await mntAgentKit.getSwapQuote(
          fromTokenAddress,
          toTokenAddress,
          amount,
          slippagePercentage,
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "okx_get_swap_quote",
            result: `Fetched swap quote from ${fromTokenAddress} to ${toTokenAddress} for ${amount}`,
          },
        });

        return quote;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "okx_get_swap_quote",
            error: `Failed to get swap quote: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        fromTokenAddress: z
          .string()
          .describe("address of the token to swap from"),
        toTokenAddress: z
          .string()
          .describe("address of the token to swap to"),
        amount: z
          .string()
          .describe(
            "amount of tokens to swap. Human readable: e.g: 0.01, 10, 100 etc",
          ),
        slippagePercentage: z
          .string()
          .optional()
          .describe("slippage tolerance percentage (default: 0.5)"),
      }),
    },
  );
};

export const createExecuteSwap = (deps: ToolDependencies) => {
  const meta = getToolMetadata("okx_execute_swap");
  return tool(
    async ({ fromTokenAddress, toTokenAddress, amount, slippagePercentage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tools_selected",
        data: {
          tool: "okx_execute_swap",
          args: { fromTokenAddress, toTokenAddress, amount, slippagePercentage },
        },
      });

      try {
        const result = await mntAgentKit.executeSwap(
          fromTokenAddress,
          toTokenAddress,
          amount,
          slippagePercentage,
        );

        const txHash = typeof result === "string" ? result : (result as any)?.transactionHash || (result as any)?.hash;

        if (txHash) {
          const receipt = await mntAgentKit.client.waitForTransactionReceipt({
            hash: txHash,
          });

          await eventLogger.emit({
            type: "tool_result",
            data: {
              tool: "okx_execute_swap",
              result: `Swapped ${amount} tokens from ${fromTokenAddress} to ${toTokenAddress}. TxHash: ${txHash}`,
              txHash: receipt.transactionHash,
              blockNumber: receipt.blockNumber.toString(),
            },
          });

          return receipt;
        }

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "okx_execute_swap",
            result: `Swapped ${amount} tokens from ${fromTokenAddress} to ${toTokenAddress}`,
          },
        });

        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "okx_execute_swap",
            error: `Failed to execute swap: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        fromTokenAddress: z
          .string()
          .describe("address of the token to swap from"),
        toTokenAddress: z
          .string()
          .describe("address of the token to swap to"),
        amount: z
          .string()
          .describe(
            "amount of tokens to swap. Human readable: e.g: 0.01, 10, 100 etc",
          ),
        slippagePercentage: z
          .string()
          .optional()
          .describe("slippage tolerance percentage (default: 0.5)"),
      }),
    },
  );
};
