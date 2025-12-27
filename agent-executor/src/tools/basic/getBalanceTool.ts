import * as z from "zod";
import { tool } from "langchain";
import { ToolDependencies } from "../../types/tools";

export const createGetBalanceTool = (deps: ToolDependencies) => {
  return tool(
    async ({ tokenAddress }) => {
      const { account } = deps;
      // Dummy implementation
      return {
        success: true,
        address: account.address,
        tokenAddress: tokenAddress || "native",
        balance: "100.0",
        symbol: tokenAddress ? "TOKEN" : "MNT",
      };
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
