import { HermesClient } from "@pythnetwork/hermes-client";

const hermes = new HermesClient("https://hermes.pyth.network", {});

// Price cache
let priceCache: { prices: Record<string, number>; timestamp: number } | null = null;
const CACHE_TTL = 30000; // 30 seconds for Pyth

/**
 * Get Pyth price feed ID for a token symbol
 */
async function getPriceFeedId(symbol: string): Promise<string | null> {
  try {
    const feeds = await hermes.getPriceFeeds({ query: symbol.toLowerCase(), assetType: "crypto" });
    if (feeds && feeds.length > 0) {
      // Find exact match or USD pair
      const usdFeed = feeds.find(
        (f) =>
          f.attributes.base?.toLowerCase() === symbol.toLowerCase() &&
          f.attributes.quote_currency?.toLowerCase() === "usd"
      );
      return usdFeed?.id || feeds[0]?.id || null;
    }
    return null;
  } catch (err) {
    console.warn(`Failed to get price feed for ${symbol}:`, err);
    return null;
  }
}

/**
 * Fetch price for a single token from Pyth
 */
export async function getTokenPrice(symbol: string): Promise<number> {
  try {
    const feedId = await getPriceFeedId(symbol);
    if (!feedId) return 0;

    const priceUpdates = await hermes.getLatestPriceUpdates([feedId]);
    if (priceUpdates?.parsed?.[0]?.price) {
      const priceData = priceUpdates.parsed[0].price;
      // Convert price with exponent: price * 10^expo
      const price = Number(priceData.price) * Math.pow(10, priceData.expo);
      return price;
    }
    return 0;
  } catch (err) {
    console.warn(`Failed to fetch price for ${symbol}:`, err);
    return 0;
  }
}

/**
 * Fetch prices for multiple tokens from Pyth
 */
export async function getTokenPrices(symbols: string[]): Promise<Record<string, number>> {
  // Check cache
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_TTL) {
    // Return cached prices for requested symbols
    const cached: Record<string, number> = {};
    let allCached = true;
    for (const sym of symbols) {
      if (sym in priceCache.prices) {
        cached[sym] = priceCache.prices[sym];
      } else {
        allCached = false;
      }
    }
    if (allCached) return cached;
  }

  const prices: Record<string, number> = {};

  try {
    // Get feed IDs for all symbols
    const feedIdMap: Record<string, string> = {};
    const feedIds: string[] = [];

    await Promise.all(
      symbols.map(async (symbol) => {
        const feedId = await getPriceFeedId(symbol);
        if (feedId) {
          feedIdMap[feedId] = symbol;
          feedIds.push(feedId);
        }
      })
    );

    if (feedIds.length > 0) {
      const priceUpdates = await hermes.getLatestPriceUpdates(feedIds);

      if (priceUpdates?.parsed) {
        for (const update of priceUpdates.parsed) {
          const symbol = feedIdMap[update.id];
          if (symbol && update.price) {
            const price = Number(update.price.price) * Math.pow(10, update.price.expo);
            prices[symbol] = price;
          }
        }
      }
    }

    // Stablecoins default to $1 if not found
    for (const sym of symbols) {
      if (!(sym in prices)) {
        if (sym === "USDC" || sym === "USDT" || sym === "DAI") {
          prices[sym] = 1;
        } else {
          prices[sym] = 0;
        }
      }
    }

    // Update cache
    priceCache = {
      prices: { ...priceCache?.prices, ...prices },
      timestamp: Date.now(),
    };

    return prices;
  } catch (err) {
    console.error("Failed to fetch prices from Pyth:", err);
    // Return stablecoin defaults
    for (const sym of symbols) {
      if (sym === "USDC" || sym === "USDT" || sym === "DAI") {
        prices[sym] = 1;
      } else {
        prices[sym] = 0;
      }
    }
    return prices;
  }
}
