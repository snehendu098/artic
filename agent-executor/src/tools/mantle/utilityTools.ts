import { tool } from "langchain";
import { ToolDependencies } from "../../types";
import z from "zod";
import { Address, formatUnits, erc20Abi } from "viem";
import { approveToken } from "mantle-agent-kit-sdk";

export const createApproveTokenTool = (deps: ToolDependencies) => {
  return tool(
    async ({ tokenAddress, amount }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: {
          tool: "approve_token",
          args: { tokenAddress, amount },
        },
      });

      try {
        const result = await approveToken(mntAgentKit, tokenAddress, amount);

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "approve_token",
            result: `Approved ${amount} tokens`,
            note: result.allowanceExists
              ? "Allowance already exists"
              : `txData: ${JSON.stringify(result.data)}`,
          },
        });

        return { success: true, allowanceExists: result.allowanceExists };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "approve_token",
            result: `Token approval failed: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "approve_token",
      description:
        "Approve tokens for spending (used before swaps/lending operations)",
      schema: z.object({
        tokenAddress: z.string().describe("ERC20 token address"),
        amount: z.string().describe("Amount to approve (human readable)"),
      }),
    }
  );
};

export const createCheckAllowanceTool = (deps: ToolDependencies) => {
  return tool(
    async ({ tokenAddress, spenderAddress }) => {
      const { mntAgentKit, eventLogger, account } = deps;
      const client = mntAgentKit.client;

      await eventLogger.emit({
        type: "tool_call",
        data: {
          tool: "check_allowance",
          args: { tokenAddress, spenderAddress },
        },
      });

      try {
        const [allowance, decimals] = await Promise.all([
          client.readContract({
            address: tokenAddress as Address,
            abi: erc20Abi,
            functionName: "allowance",
            args: [account.address, spenderAddress as Address],
          }),
          client.readContract({
            address: tokenAddress as Address,
            abi: erc20Abi,
            functionName: "decimals",
          }),
        ]);

        const formatted = formatUnits(allowance, decimals);

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "check_allowance",
            result: `Allowance: ${formatted}`,
            note: `Spender: ${spenderAddress}`,
          },
        });

        return { success: true, allowance: formatted, raw: allowance.toString() };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "check_allowance",
            result: `Failed to check allowance: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "check_allowance",
      description: "Check how much of a token a spender is allowed to spend",
      schema: z.object({
        tokenAddress: z.string().describe("ERC20 token address"),
        spenderAddress: z.string().describe("Spender address to check"),
      }),
    }
  );
};
