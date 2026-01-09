import { tool } from "langchain";
import { ToolDependencies } from "../../../types";
import z from "zod";
import { getToolMetadata } from "../../../helpers/getToolMetadata";

export const createPythGetPrice = (deps: ToolDependencies) => {
  const meta = getToolMetadata("pyth_get_price");
  return tool(
    async ({ identifier }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "pyth_get_price", args: { identifier } },
      });

      try {
        const result = await mntAgentKit.pythGetPrice(identifier);

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "pyth_get_price",
            result: `Fetched ${result.pair} price: ${result.formattedPrice} (confidence: ±${result.confidence})`,
          },
        });

        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "pyth_get_price",
            error: `Failed to fetch price: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        identifier: z
          .string()
          .describe(
            "Price feed identifier, pair name (BTC/USD), token address, or feed ID",
          ),
      }),
    },
  );
};

export const createPythGetEmaPrice = (deps: ToolDependencies) => {
  const meta = getToolMetadata("pyth_get_ema_price");
  return tool(
    async ({ identifier }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "pyth_get_ema_price", args: { identifier } },
      });

      try {
        const result = await mntAgentKit.pythGetEmaPrice(identifier);

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "pyth_get_ema_price",
            result: `Fetched ${result.pair} EMA price: ${result.formattedPrice} (confidence: ±${result.confidence})`,
          },
        });

        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "pyth_get_ema_price",
            error: `Failed to fetch EMA price: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        identifier: z
          .string()
          .describe("Price feed identifier or pair name for EMA calculation"),
      }),
    },
  );
};

export const createPythGetTokenPrice = (deps: ToolDependencies) => {
  const meta = getToolMetadata("pyth_get_token_price");
  return tool(
    async ({ tokenAddress }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "pyth_get_token_price", args: { tokenAddress } },
      });

      try {
        const result = await mntAgentKit.pythGetTokenPrice(tokenAddress);

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "pyth_get_token_price",
            result: `Fetched ${result.tokenSymbol} price: $${result.priceUsd} (${result.pair})`,
          },
        });

        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "pyth_get_token_price",
            error: `Failed to fetch token price: ${errorMsg}`,
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
          .describe(
            "Contract address of the token to get price for (e.g., 0x09Bc4E0D...)",
          ),
      }),
    },
  );
};

export const createPythGetMultiplePrices = (deps: ToolDependencies) => {
  const meta = getToolMetadata("pyth_get_multiple_prices");
  return tool(
    async ({ identifiers }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "pyth_get_multiple_prices", args: { identifiers } },
      });

      try {
        const results = await mntAgentKit.pythGetMultiplePrices(identifiers);

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "pyth_get_multiple_prices",
            result: `Fetched ${results.length} prices: ${results.map((r) => `${r.pair}: ${r.formattedPrice}`).join(", ")}`,
          },
        });

        return results;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "pyth_get_multiple_prices",
            error: `Failed to fetch multiple prices: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        identifiers: z
          .array(z.string())
          .describe(
            "Array of price feed identifiers or pair names to fetch prices for",
          ),
      }),
    },
  );
};

export const createPythGetSupportedFeeds = (deps: ToolDependencies) => {
  const meta = getToolMetadata("pyth_get_supported_feeds");
  return tool(
    async () => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "pyth_get_supported_feeds", args: {} },
      });

      try {
        const result = await mntAgentKit.pythGetSupportedPriceFeeds();

        const feedCount = Object.keys(result).length;

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "pyth_get_supported_feeds",
            result: `Retrieved ${feedCount} supported price feeds`,
          },
        });

        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "pyth_get_supported_feeds",
            error: `Failed to fetch supported feeds: ${errorMsg}`,
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

export const createPythGetSupportedTokens = (deps: ToolDependencies) => {
  const meta = getToolMetadata("pyth_get_supported_tokens");
  return tool(
    async () => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "pyth_get_supported_tokens", args: {} },
      });

      try {
        const result = await mntAgentKit.pythGetSupportedTokenAddresses();

        const tokenCount = Object.keys(result).length;

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "pyth_get_supported_tokens",
            result: `Retrieved ${tokenCount} supported token addresses`,
          },
        });

        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "pyth_get_supported_tokens",
            error: `Failed to fetch supported tokens: ${errorMsg}`,
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

export const createPythFeedExists = (deps: ToolDependencies) => {
  const meta = getToolMetadata("pyth_feed_exists");
  return tool(
    async ({ identifier }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "pyth_feed_exists", args: { identifier } },
      });

      try {
        const result = await mntAgentKit.pythPriceFeedExists(identifier);

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "pyth_feed_exists",
            result: `Price feed ${identifier} ${result ? "exists" : "does not exist"}`,
          },
        });

        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        await eventLogger.emit({
          type: "error",
          data: {
            tool: "pyth_feed_exists",
            error: `Failed to check feed existence: ${errorMsg}`,
          },
        });

        throw error;
      }
    },
    {
      name: meta.name,
      description: meta.longDesc,
      schema: z.object({
        identifier: z
          .string()
          .describe("Price feed identifier or token address to check availability"),
      }),
    },
  );
};
