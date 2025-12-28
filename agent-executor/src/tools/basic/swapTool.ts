import * as z from "zod";
import { tool } from "langchain";
import { ToolDependencies } from "../../types/tools";

export const createSwapTool = (deps: ToolDependencies) => {
  return tool(
    async ({ fromToken, toToken, amount }) => {
      const { eventLogger } = deps;

      try {
        console.log(fromToken, toToken);

        await eventLogger.emit({
          type: "tool_call",
          data: {
            tool: "swap",
            args: { fromToken, toToken, amount },
          },
        });

        // Dummy implementation
        const amountOut = (parseFloat(amount) * 0.99).toString();

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "swap",
            result: `Swapped ${amount} ${fromToken} for ${amountOut} ${toToken}`,
            note: "Executed swap at market rate with 1% slippage",
          },
        });

        return {
          success: true,
          txHash: "0x" + "0".repeat(64),
          fromToken,
          toToken,
          amountIn: amount,
          amountOut,
        };
      } catch (err: any) {
        console.log("swap error:", err);
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "swap",
            result: `Failed to swap ${amount} ${fromToken}`,
            note: err.message || "Unknown error",
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "swap",
      description: `Swap tokens on a DEX. Converts one token to another at current market rate`,
      schema: z.object({
        fromToken: z
          .string()
          .describe("The token address to swap from. Use 'native' for MNT"),
        toToken: z
          .string()
          .describe("The token address to swap to. Use 'native' for MNT"),
        amount: z
          .string()
          .describe("The amount to swap (in human readable format)"),
      }),
    },
  );
};
