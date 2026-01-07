import { tool } from "langchain";
import { ToolDependencies } from "../../../types";
import z from "zod";
import { Address } from "viem";
import { getToolMetadata } from "../../../helpers/getToolMetadata";

export const createLendleSupply = (deps: ToolDependencies) => {
  const meta = getToolMetadata("lendle_supply");
  return tool(
    async ({ tokenAddress, amount }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tools_selected",
        data: {
          tool: "lendle_supply",
          args: { tokenAddress, amount },
        },
      });

      try {
        const txHash = await mntAgentKit.lendleSupply(
          tokenAddress as Address,
          amount,
        );

        const receipt = await mntAgentKit.client.waitForTransactionReceipt({
          hash: txHash,
        });

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_supply",
            result: `Supplied ${amount} tokens to Lendle. TxHash: ${txHash}`,
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
            tool: "lendle_supply",
            error: `Failed to supply tokens to Lendle: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        tokenAddress: z
          .string()
          .describe("address of the token to supply for earning yield"),
        amount: z
          .string()
          .describe(
            "amount of tokens to supply to lendle for earning yield. Human readable: e.g: 0.01, 10, 100 etc",
          ),
      }),
    },
  );
};

export const createLendleWithdraw = (deps: ToolDependencies) => {
  const meta = getToolMetadata("lendle_withdraw");
  return tool(
    async ({ tokenAddress, amount, to }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tools_selected",
        data: {
          tool: "lendle_withdraw",
          args: { tokenAddress, amount, to },
        },
      });

      try {
        const txHash = await mntAgentKit.lendleWithdraw(
          tokenAddress as Address,
          amount,
          to as Address | undefined,
        );

        const receipt = await mntAgentKit.client.waitForTransactionReceipt({
          hash: txHash,
        });

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_withdraw",
            result: `Withdrew ${amount} tokens from Lendle. TxHash: ${txHash}`,
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
            tool: "lendle_withdraw",
            error: `Failed to withdraw tokens from Lendle: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        tokenAddress: z.string().describe("address of the token to withdraw"),
        amount: z
          .string()
          .describe(
            "amount of tokens to withdraw from lendle. Human readable: e.g: 0.01, 10, 100 etc",
          ),
        to: z
          .string()
          .optional()
          .describe("optional recipient address for withdrawn tokens"),
      }),
    },
  );
};

export const createLendleBorrow = (deps: ToolDependencies) => {
  const meta = getToolMetadata("lendle_borrow");
  return tool(
    async ({ tokenAddress, amount, interestRateMode, onBehalfOf }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tools_selected",
        data: {
          tool: "lendle_borrow",
          args: { tokenAddress, amount, interestRateMode, onBehalfOf },
        },
      });

      try {
        const txHash = await mntAgentKit.lendleBorrow(
          tokenAddress as Address,
          amount,
          interestRateMode as 1 | 2 | undefined,
          onBehalfOf as Address | undefined,
        );

        const receipt = await mntAgentKit.client.waitForTransactionReceipt({
          hash: txHash,
        });

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_borrow",
            result: `Borrowed ${amount} tokens from Lendle. TxHash: ${txHash}`,
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
            tool: "lendle_borrow",
            error: `Failed to borrow tokens from Lendle: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        tokenAddress: z.string().describe("address of the token to borrow"),
        amount: z
          .string()
          .describe(
            "amount of tokens to borrow from lendle. Human readable: e.g: 0.01, 10, 100 etc",
          ),
        interestRateMode: z
          .number()
          .optional()
          .describe("1 for stable rate, 2 for variable rate (default is 2)"),
        onBehalfOf: z
          .string()
          .optional()
          .describe("optional address to borrow on behalf of"),
      }),
    },
  );
};

export const createLendleRepay = (deps: ToolDependencies) => {
  const meta = getToolMetadata("lendle_repay");
  return tool(
    async ({ tokenAddress, amount, rateMode }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tools_selected",
        data: {
          tool: "lendle_repay",
          args: { tokenAddress, amount, rateMode },
        },
      });

      try {
        const txHash = await mntAgentKit.lendleRepay(
          tokenAddress as Address,
          amount,
          rateMode as 1 | 2 | undefined,
        );

        const receipt = await mntAgentKit.client.waitForTransactionReceipt({
          hash: txHash,
        });

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_repay",
            result: `Repaid ${amount} tokens to Lendle. TxHash: ${txHash}`,
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
            tool: "lendle_repay",
            error: `Failed to repay tokens to Lendle: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        tokenAddress: z.string().describe("address of the token to repay"),
        amount: z
          .string()
          .describe(
            "amount of tokens to repay to lendle. Human readable: e.g: 0.01, 10, 100 etc",
          ),
        rateMode: z
          .number()
          .optional()
          .describe("1 for stable rate, 2 for variable rate (default is 2)"),
      }),
    },
  );
};

export const createLendleGetUserAccountData = (deps: ToolDependencies) => {
  const meta = getToolMetadata("lendle_get_user_account_data");
  return tool(
    async ({ userAddress }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tools_selected",
        data: {
          tool: "lendle_get_user_account_data",
          args: { userAddress },
        },
      });

      try {
        const accountData = await mntAgentKit.lendleGetUserAccountData(
          userAddress as Address | undefined,
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_get_user_account_data",
            result: "Fetched user account data from Lendle",
          },
        });

        return accountData;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "lendle_get_user_account_data",
            error: `Failed to get user account data from Lendle: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        userAddress: z
          .string()
          .optional()
          .describe(
            "optional user address to query, defaults to agent account",
          ),
      }),
    },
  );
};

export const createLendleGetPositions = (deps: ToolDependencies) => {
  const meta = getToolMetadata("lendle_get_positions");
  return tool(
    async ({ userAddress }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tools_selected",
        data: {
          tool: "lendle_get_positions",
          args: { userAddress },
        },
      });

      try {
        const positions = await mntAgentKit.lendleGetPositions(
          userAddress as Address | undefined,
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "lendle_get_positions",
            result: "Fetched positions from Lendle",
          },
        });

        return positions;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "lendle_get_positions",
            error: `Failed to get positions from Lendle: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        userAddress: z
          .string()
          .optional()
          .describe(
            "optional user address to query, defaults to agent account",
          ),
      }),
    },
  );
};
