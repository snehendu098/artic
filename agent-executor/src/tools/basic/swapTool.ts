import * as z from "zod";
import { tool } from "langchain";
import { ToolDependencies } from "../../types/tools";

export const createSwapTool = (deps: ToolDependencies) => {
  return tool(
    async ({ fromToken, toToken, amount }) => {
      // Dummy implementation
      return {
        success: true,
        txHash: "0x" + "0".repeat(64),
        fromToken,
        toToken,
        amountIn: amount,
        amountOut: (parseFloat(amount) * 0.99).toString(),
      };
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
