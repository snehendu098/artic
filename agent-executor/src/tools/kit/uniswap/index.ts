import { tool } from "langchain";
import { ToolDependencies } from "../../../types";
import z from "zod";
import { getToolMetadata } from "../../../helpers/getToolMetadata";

export const createUniswapSwap = (deps: ToolDependencies) => {
  const meta = getToolMetadata("uniswap_swap");
  return tool(
    async ({ tokenIn, tokenOut, amount, slippage, fee }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tools_selected",
        data: {
          tool: "uniswap_swap",
          args: { tokenIn, tokenOut, amount, slippage, fee },
        },
      });

      try {
        const txHash = await mntAgentKit.uniswapSwap(
          tokenIn,
          tokenOut,
          amount,
          slippage,
          fee,
        );

        const receipt = await mntAgentKit.client.waitForTransactionReceipt({
          hash: txHash,
        });

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "uniswap_swap",
            result: `Swapped ${amount} tokens from ${tokenIn} to ${tokenOut} via Uniswap V3. TxHash: ${txHash}`,
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
            tool: "uniswap_swap",
            error: `Failed to execute Uniswap swap: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        tokenIn: z
          .string()
          .describe("Address of the token to swap from"),
        tokenOut: z
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
        fee: z
          .number()
          .optional()
          .describe("Pool fee tier: 100 (0.01%), 500 (0.05%), 3000 (0.3%), 10000 (1%). Default: 3000"),
      }),
    },
  );
};
