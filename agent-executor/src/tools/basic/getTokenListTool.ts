import * as z from "zod";
import { tool } from "langchain";
import { ToolDependencies } from "../../types/tools";

export const createGetTokenListTool = (deps: ToolDependencies) => {
  return tool(
    async ({}) => {
      const { account, eventLogger } = deps;

      try {
        await eventLogger.emit({
          type: "tool_call",
          data: {
            tool: "get_token_list",
            args: {},
          },
        });

        // Dummy implementation
        const tokens = [
          { symbol: "MNT", address: "native", balance: "100.0" },
          { symbol: "USDC", address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9", balance: "500.0" },
          { symbol: "USDT", address: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE", balance: "250.0" },
        ];

        const summary = tokens.map((t) => `${t.balance} ${t.symbol}`).join(", ");

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "get_token_list",
            result: `Found ${tokens.length} tokens: ${summary}`,
            note: "Retrieved all token balances for wallet",
          },
        });

        return {
          success: true,
          address: account.address,
          tokens,
        };
      } catch (err: any) {
        console.log("get_token_list error:", err);
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "get_token_list",
            result: "Failed to get token list",
            note: err.message || "Unknown error",
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "get_token_list",
      description: `Get all token balances for the current wallet`,
      schema: z.object({}),
    }
  );
};
