import { tool } from "langchain";
import { ToolDependencies } from "../../types";
import z from "zod";
import { Address, erc20Abi, formatEther, formatUnits } from "viem";
import { NATIVE_TOKEN_ADDRESS } from "./constants";

export const createGetBalanceTool = (deps: ToolDependencies) => {
  return tool(
    async ({ tokenAddress }) => {
      const { mntAgentKit, eventLogger, account } = deps;
      const client = mntAgentKit.client;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "get_balance", args: { tokenAddress } },
      });

      try {
        const isNative =
          !tokenAddress ||
          tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();

        let balance: string;
        let symbol: string;

        if (isNative) {
          const rawBalance = await client.getBalance({
            address: account.address,
          });
          balance = formatEther(rawBalance);
          symbol = "MNT";
        } else {
          const [rawBalance, decimals, tokenSymbol] = await Promise.all([
            client.readContract({
              address: tokenAddress as Address,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [account.address],
            }),
            client.readContract({
              address: tokenAddress as Address,
              abi: erc20Abi,
              functionName: "decimals",
            }),
            client.readContract({
              address: tokenAddress as Address,
              abi: erc20Abi,
              functionName: "symbol",
            }),
          ]);
          balance = formatUnits(rawBalance, decimals);
          symbol = tokenSymbol;
        }

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "get_balance",
            result: `Balance: ${balance} ${symbol}`,
            note: `Wallet: ${account.address}`,
          },
        });

        return { success: true, balance, symbol, address: account.address };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "get_balance",
            result: `Failed to get balance: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "get_balance",
      description:
        "Get the balance of native MNT or any ERC20 token. If no tokenAddress provided, returns native MNT balance.",
      schema: z.object({
        tokenAddress: z
          .string()
          .optional()
          .describe(
            "Token contract address. Omit or use 0xEeee...eeEE for native MNT"
          ),
      }),
    }
  );
};
