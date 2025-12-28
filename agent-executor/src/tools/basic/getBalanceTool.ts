import * as z from "zod";
import { tool } from "langchain";
import { ToolDependencies } from "../../types/tools";

export const createGetBalanceTool = (deps: ToolDependencies) => {
  return tool(
    async ({ tokenAddress }) => {
      const { account, eventLogger } = deps;

      try {
        await eventLogger.emit({
          type: "tool_call",
          data: {
            tool: "get_balance",
            args: { tokenAddress },
          },
        });

        // Dummy implementation
        const symbol = tokenAddress ? "TOKEN" : "MNT";
        const balance = "500";

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "get_balance",
            result: `Balance: ${balance} ${symbol}`,
            note: `Checked ${symbol} balance for wallet`,
          },
        });

        return {
          success: true,
          address: account.address,
          tokenAddress: tokenAddress || "native",
          balance,
          symbol,
        };
      } catch (err: any) {
        console.log("get_balance error:", err);
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "get_balance",
            result: "Failed to get balance",
            note: err.message || "Unknown error",
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "get_balance",
      description: `Get the balance of MNT or an ERC20 token for the current wallet`,
      schema: z.object({
        tokenAddress: z
          .string()
          .optional()
          .describe(
            "The ERC20 token contract address. Leave empty for native MNT balance",
          ),
      }),
    },
  );
};
