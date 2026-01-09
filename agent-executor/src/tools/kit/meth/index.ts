import { tool } from "langchain";
import { ToolDependencies } from "../../../types";
import z from "zod";
import { Address } from "viem";
import { getToolMetadata } from "../../../helpers/getToolMetadata";

export const createGetMethTokenAddress = (deps: ToolDependencies) => {
  const meta = getToolMetadata("meth_get_token_address");
  return tool(
    async () => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: {
          tool: "meth_get_token_address",
          args: {},
        },
      });

      try {
        const address = mntAgentKit.getMethTokenAddress();

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "meth_get_token_address",
            result: `mETH token address: ${address}`,
          },
        });

        return address;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "meth_get_token_address",
            error: `Failed to get mETH token address: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({}),
    },
  );
};

export const createMethGetPosition = (deps: ToolDependencies) => {
  const meta = getToolMetadata("meth_get_position");
  return tool(
    async ({ userAddress }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: {
          tool: "meth_get_position",
          args: { userAddress },
        },
      });

      try {
        const position = await mntAgentKit.methGetPosition(
          userAddress as Address | undefined,
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "meth_get_position",
            result: "Fetched mETH position",
          },
        });

        return position;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "meth_get_position",
            error: `Failed to get mETH position: ${errorMsg}`,
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

export const createSwapToMeth = (deps: ToolDependencies) => {
  const meta = getToolMetadata("meth_swap_to_meth");
  return tool(
    async ({ amount, slippage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: {
          tool: "meth_swap_to_meth",
          args: { amount, slippage },
        },
      });

      try {
        const txHash = await mntAgentKit.swapToMeth(amount, slippage);

        const receipt = await mntAgentKit.client.waitForTransactionReceipt({
          hash: txHash,
        });

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "meth_swap_to_meth",
            result: `Swapped ${amount} WETH to mETH. TxHash: ${txHash}`,
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
            tool: "meth_swap_to_meth",
            error: `Failed to swap WETH to mETH: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        amount: z
          .string()
          .describe("amount of WETH to swap to mETH. Human readable: e.g: 0.01, 10, 100 etc"),
        slippage: z
          .number()
          .optional()
          .describe("slippage tolerance percentage (default: 0.5)"),
      }),
    },
  );
};

export const createSwapFromMeth = (deps: ToolDependencies) => {
  const meta = getToolMetadata("meth_swap_from_meth");
  return tool(
    async ({ amount, slippage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: {
          tool: "meth_swap_from_meth",
          args: { amount, slippage },
        },
      });

      try {
        const txHash = await mntAgentKit.swapFromMeth(amount, slippage);

        const receipt = await mntAgentKit.client.waitForTransactionReceipt({
          hash: txHash,
        });

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "meth_swap_from_meth",
            result: `Swapped ${amount} mETH to WETH. TxHash: ${txHash}`,
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
            tool: "meth_swap_from_meth",
            error: `Failed to swap mETH to WETH: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        amount: z
          .string()
          .describe("amount of mETH to swap to WETH. Human readable: e.g: 0.01, 10, 100 etc"),
        slippage: z
          .number()
          .optional()
          .describe("slippage tolerance percentage (default: 0.5)"),
      }),
    },
  );
};
