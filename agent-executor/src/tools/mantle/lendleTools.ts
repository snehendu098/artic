import { tool } from "langchain";
import { ToolDependencies } from "../../types";
import z from "zod";
import { Address } from "viem";

export const createLendleSupplyTool = (deps: ToolDependencies) => {
  return tool(
    async ({ tokenAddress, amount }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "lendle_supply", args: { tokenAddress, amount } },
      });

      try {
        const txHash = await mntAgentKit.lendleSupply(
          tokenAddress as Address,
          amount
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_supply",
            result: `Supplied ${amount} to Lendle`,
            note: `txHash: ${txHash}`,
          },
        });

        return { success: true, txHash };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_supply",
            result: `Lendle supply failed: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "lendle_supply",
      description: "Supply/deposit tokens to Lendle lending protocol to earn yield",
      schema: z.object({
        tokenAddress: z.string().describe("Token address to supply"),
        amount: z.string().describe("Amount to supply (human readable)"),
      }),
    }
  );
};

export const createLendleWithdrawTool = (deps: ToolDependencies) => {
  return tool(
    async ({ tokenAddress, amount, to }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "lendle_withdraw", args: { tokenAddress, amount, to } },
      });

      try {
        const txHash = await mntAgentKit.lendleWithdraw(
          tokenAddress as Address,
          amount,
          to as Address | undefined
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_withdraw",
            result: `Withdrew ${amount} from Lendle`,
            note: `txHash: ${txHash}`,
          },
        });

        return { success: true, txHash };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_withdraw",
            result: `Lendle withdraw failed: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "lendle_withdraw",
      description: "Withdraw tokens from Lendle lending protocol",
      schema: z.object({
        tokenAddress: z.string().describe("Token address to withdraw"),
        amount: z.string().describe("Amount to withdraw (human readable)"),
        to: z.string().optional().describe("Recipient address (default: self)"),
      }),
    }
  );
};

export const createLendleBorrowTool = (deps: ToolDependencies) => {
  return tool(
    async ({ tokenAddress, amount, interestRateMode }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "lendle_borrow", args: { tokenAddress, amount, interestRateMode } },
      });

      try {
        const txHash = await mntAgentKit.lendleBorrow(
          tokenAddress as Address,
          amount,
          interestRateMode as 1 | 2 | undefined
        );

        const rateType = interestRateMode === 1 ? "stable" : "variable";

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_borrow",
            result: `Borrowed ${amount} from Lendle (${rateType} rate)`,
            note: `txHash: ${txHash}`,
          },
        });

        return { success: true, txHash };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_borrow",
            result: `Lendle borrow failed: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "lendle_borrow",
      description: "Borrow tokens from Lendle lending protocol",
      schema: z.object({
        tokenAddress: z.string().describe("Token address to borrow"),
        amount: z.string().describe("Amount to borrow (human readable)"),
        interestRateMode: z
          .number()
          .optional()
          .describe("1=stable, 2=variable (default 2)"),
      }),
    }
  );
};

export const createLendleRepayTool = (deps: ToolDependencies) => {
  return tool(
    async ({ tokenAddress, amount, rateMode }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "lendle_repay", args: { tokenAddress, amount, rateMode } },
      });

      try {
        const txHash = await mntAgentKit.lendleRepay(
          tokenAddress as Address,
          amount,
          rateMode as 1 | 2 | undefined
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_repay",
            result: `Repaid ${amount} to Lendle`,
            note: `txHash: ${txHash}`,
          },
        });

        return { success: true, txHash };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_repay",
            result: `Lendle repay failed: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "lendle_repay",
      description: "Repay borrowed tokens to Lendle lending protocol",
      schema: z.object({
        tokenAddress: z.string().describe("Token address to repay"),
        amount: z.string().describe("Amount to repay (human readable)"),
        rateMode: z
          .number()
          .optional()
          .describe("1=stable, 2=variable (default 2)"),
      }),
    }
  );
};

