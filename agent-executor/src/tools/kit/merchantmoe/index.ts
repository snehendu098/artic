import { tool } from "langchain";
import { ToolDependencies } from "../../../types";
import z from "zod";
import { getToolMetadata } from "../../../helpers/getToolMetadata";
import { Address } from "viem";

export const createMerchantmoeSwap = (deps: ToolDependencies) => {
  const meta = getToolMetadata("merchantmoe_swap");
  return tool(
    async ({ tokenIn, tokenOut, amountIn, slippage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: {
          tool: "merchantmoe_swap",
          args: { tokenIn, tokenOut, amountIn, slippage },
        },
      });

      try {
        const txHash = await mntAgentKit.merchantMoeSwap(
          tokenIn as Address,
          tokenOut as Address,
          amountIn,
          slippage,
        );

        const receipt = await mntAgentKit.client.waitForTransactionReceipt({
          hash: txHash,
        });

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "merchantmoe_swap",
            result: `Swapped ${amountIn} tokens from ${tokenIn} to ${tokenOut} via Merchant Moe. TxHash: ${txHash}`,
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
            tool: "merchantmoe_swap",
            error: `Failed to execute Merchant Moe swap: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        tokenIn: z.string().describe("Address of the token to swap from"),
        tokenOut: z.string().describe("Address of the token to swap to"),
        amountIn: z
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
