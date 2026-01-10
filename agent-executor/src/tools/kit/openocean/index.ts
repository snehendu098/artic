import { tool } from "langchain";
import { ToolDependencies } from "../../../types";
import z from "zod";
import { getToolMetadata } from "../../../helpers/getToolMetadata";
import { Address, formatUnits } from "viem";

export const createOpenoceanGetTokens = (deps: ToolDependencies) => {
  const meta = getToolMetadata("openocean_get_tokens");
  return tool(
    async () => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: {
          tool: "openocean_get_tokens",
          args: {},
        },
      });

      try {
        const tokens = await mntAgentKit.getOpenOceanTokens();

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "openocean_get_tokens",
            result: `Fetched ${tokens.length} tokens from OpenOcean`,
          },
        });

        return JSON.stringify(tokens);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "openocean_get_tokens",
            error: `Failed to get OpenOcean tokens: ${errorMsg}`,
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

export const createOpenoceanGetQuote = (deps: ToolDependencies) => {
  const meta = getToolMetadata("openocean_get_quote");
  return tool(
    async ({ fromToken, toToken, amount }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: {
          tool: "openocean_get_quote",
          args: { fromToken, toToken, amount },
        },
      });

      try {
        const quote = await mntAgentKit.getOpenOceanQuote(
          fromToken as Address,
          toToken as Address,
          amount,
        );

        const inAmountFormatted = formatUnits(
          BigInt(quote.inAmount),
          quote.inToken.decimals,
        );
        const outAmountFormatted = formatUnits(
          BigInt(quote.outAmount),
          quote.outToken.decimals,
        );

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "openocean_get_quote",
            result: `Fetched OpenOcean swap quote from ${fromToken} to ${toToken} for ${amount}`,
          },
        });

        return JSON.stringify({
          inToken: quote.inToken,
          outToken: quote.outToken,
          inAmount: inAmountFormatted,
          outAmount: outAmountFormatted,
        });
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "openocean_get_quote",
            error: `Failed to get OpenOcean quote: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        fromToken: z
          .string()
          .describe("Address of the token to swap from. Starts with 0x"),
        toToken: z
          .string()
          .describe("Address of the token to swap to. Starts with 0x"),
        amount: z
          .string()
          .describe(
            "Amount of tokens to swap. Human readable: e.g: 0.01, 10, 100 etc",
          ),
      }),
    },
  );
};

export const createOpenoceanSwap = (deps: ToolDependencies) => {
  const meta = getToolMetadata("openocean_swap");
  return tool(
    async ({ fromToken, toToken, amount, slippage }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: {
          tool: "openocean_swap",
          args: { fromToken, toToken, amount, slippage },
        },
      });

      try {
        // Get tokens to find decimals for output formatting
        const tokens = await mntAgentKit.getOpenOceanTokens();

        const outTokenInfo = tokens.find(
          (t) => t.address.toLowerCase() === toToken.toLowerCase(),
        );

        const swapResult = await mntAgentKit.swapOnOpenOcean(
          fromToken as Address,
          toToken as Address,
          amount,
          slippage,
        );

        const receipt = await mntAgentKit.client.waitForTransactionReceipt({
          hash: swapResult.txHash as Address,
        });

        const outAmountFormatted = outTokenInfo
          ? formatUnits(BigInt(swapResult.outAmount), outTokenInfo.decimals)
          : swapResult.outAmount;

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "openocean_swap",
            result: `Swapped ${amount} tokens from ${fromToken} to ${toToken} via OpenOcean. TxHash: ${swapResult.txHash}`,
            txHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber.toString(),
          },
        });

        return JSON.stringify({
          txHash: swapResult.txHash,
          outAmount: outAmountFormatted,
          outTokenSymbol: outTokenInfo?.symbol,
        });
      } catch (error) {
        console.log(error);

        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "openocean_swap",
            error: `Failed to execute OpenOcean swap: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        fromToken: z.string().describe("Address of the token to swap from"),
        toToken: z.string().describe("Address of the token to swap to"),
        amount: z
          .string()
          .describe(
            "Amount of tokens to swap. Human readable: e.g: 0.01, 10, 100 etc",
          ),
        slippage: z
          .number()
          .optional()
          .describe("Slippage tolerance percentage (default: 0.5)"),
      }),
    },
  );
};
