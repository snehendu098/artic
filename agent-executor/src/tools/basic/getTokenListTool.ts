import * as z from "zod";
import { tool } from "langchain";
import { ToolDependencies } from "../../types/tools";

export const createGetTokenListTool = (deps: ToolDependencies) => {
  return tool(
    async ({}) => {
      const { account } = deps;
      // Dummy implementation
      return {
        success: true,
        address: account.address,
        tokens: [
          { symbol: "MNT", address: "native", balance: "100.0" },
          { symbol: "USDC", address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9", balance: "500.0" },
          { symbol: "USDT", address: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE", balance: "250.0" },
        ],
      };
    },
    {
      name: "get_token_list",
      description: `Get all token balances for the current wallet`,
      schema: z.object({}),
    },
  );
};
