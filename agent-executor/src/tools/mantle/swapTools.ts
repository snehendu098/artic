import { tool } from "langchain";
import { ToolDependencies } from "../../types";
import z from "zod";
import { Address } from "viem";

const swapSchema = z.object({
  fromToken: z.string().describe("Source token address"),
  toToken: z.string().describe("Destination token address"),
  amount: z.string().describe("Amount to swap (human readable)"),
  slippage: z.number().optional().describe("Slippage percentage (default 0.5)"),
});

export const createOkxSwapTool = (deps: ToolDependencies) => {
  return tool(
    async ({ fromToken, toToken, amount, slippage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "okx_swap", args: { fromToken, toToken, amount, slippage } },
      });

      try {
        const result = await mntAgentKit.executeSwap(
          fromToken,
          toToken,
          amount,
          slippage?.toString()
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "okx_swap",
            result: `Swapped ${amount} via OKX DEX`,
            note: `txHash: ${result.data}`,
          },
        });

        return { success: true, txHash: result.data, demo: (result as any).demo };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "okx_swap",
            result: `OKX swap failed: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "okx_swap",
      description: "Swap tokens using OKX DEX aggregator",
      schema: swapSchema,
    }
  );
};

export const createOneInchSwapTool = (deps: ToolDependencies) => {
  return tool(
    async ({ fromToken, toToken, amount, slippage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "oneinch_swap", args: { fromToken, toToken, amount, slippage } },
      });

      try {
        const result = await mntAgentKit.swapOn1inch(
          fromToken as Address,
          toToken as Address,
          amount,
          slippage
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "oneinch_swap",
            result: `Swapped ${amount} via 1inch, received ${result.dstAmount}`,
            note: `txHash: ${result.txHash}`,
          },
        });

        return { success: true, txHash: result.txHash, amountOut: result.dstAmount };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "oneinch_swap",
            result: `1inch swap failed: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "oneinch_swap",
      description: "Swap tokens using 1inch DEX aggregator",
      schema: swapSchema,
    }
  );
};

export const createOpenOceanSwapTool = (deps: ToolDependencies) => {
  return tool(
    async ({ fromToken, toToken, amount, slippage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "openocean_swap", args: { fromToken, toToken, amount, slippage } },
      });

      try {
        const result = await mntAgentKit.swapOnOpenOcean(
          fromToken as Address,
          toToken as Address,
          amount,
          slippage
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "openocean_swap",
            result: `Swapped ${amount} via OpenOcean, received ${result.outAmount}`,
            note: `txHash: ${result.txHash}`,
          },
        });

        return { success: true, txHash: result.txHash, amountOut: result.outAmount };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "openocean_swap",
            result: `OpenOcean swap failed: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "openocean_swap",
      description: "Swap tokens using OpenOcean DEX aggregator",
      schema: swapSchema,
    }
  );
};

export const createUniswapSwapTool = (deps: ToolDependencies) => {
  return tool(
    async ({ fromToken, toToken, amount, slippage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "uniswap_swap", args: { fromToken, toToken, amount, slippage } },
      });

      try {
        const result = await mntAgentKit.swapOnUniswap(
          fromToken as Address,
          toToken as Address,
          amount,
          slippage
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "uniswap_swap",
            result: `Swapped ${amount} via Uniswap V3, received ${result.amountOut}`,
            note: `txHash: ${result.txHash}`,
          },
        });

        return { success: true, txHash: result.txHash, amountOut: result.amountOut };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "uniswap_swap",
            result: `Uniswap swap failed: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "uniswap_swap",
      description: "Swap tokens using Uniswap V3",
      schema: swapSchema,
    }
  );
};

export const createAgniSwapTool = (deps: ToolDependencies) => {
  return tool(
    async ({ fromToken, toToken, amount, slippage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "agni_swap", args: { fromToken, toToken, amount, slippage } },
      });

      try {
        const txHash = await mntAgentKit.agniSwap(
          fromToken as Address,
          toToken as Address,
          amount,
          slippage
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "agni_swap",
            result: `Swapped ${amount} via Agni Finance`,
            note: `txHash: ${txHash}`,
          },
        });

        return { success: true, txHash };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "agni_swap",
            result: `Agni swap failed: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "agni_swap",
      description: "Swap tokens using Agni Finance (native Mantle DEX)",
      schema: swapSchema,
    }
  );
};

export const createMerchantMoeSwapTool = (deps: ToolDependencies) => {
  return tool(
    async ({ fromToken, toToken, amount, slippage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "merchant_moe_swap", args: { fromToken, toToken, amount, slippage } },
      });

      try {
        const txHash = await mntAgentKit.merchantMoeSwap(
          fromToken as Address,
          toToken as Address,
          amount,
          slippage
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "merchant_moe_swap",
            result: `Swapped ${amount} via Merchant Moe`,
            note: `txHash: ${txHash}`,
          },
        });

        return { success: true, txHash };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "merchant_moe_swap",
            result: `Merchant Moe swap failed: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "merchant_moe_swap",
      description: "Swap tokens using Merchant Moe (native Mantle DEX)",
      schema: swapSchema,
    }
  );
};
