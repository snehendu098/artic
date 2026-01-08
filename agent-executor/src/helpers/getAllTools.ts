import { StructuredToolInterface } from "@langchain/core/tools";
import { ToolDependencies } from "../types/tools";
import {
  createPythGetPrice,
  createPythGetEmaPrice,
  createPythGetTokenPrice,
  createPythGetMultiplePrices,
  createPythGetSupportedFeeds,
  createPythGetSupportedTokens,
  createPythFeedExists,
  createLendleBorrow,
  createLendleGetPositions,
  createLendleGetUserAccountData,
  createLendleRepay,
  createLendleSupply,
  createLendleWithdraw,
  createGetSwapQuote,
  createExecuteSwap,
  createGetMethTokenAddress,
  createMethGetPosition,
  createSwapToMeth,
  createSwapFromMeth,
  createOneinchGetQuote,
  createOneinchSwap,
  createOpenoceanGetQuote,
  createOpenoceanSwap,
  createMerchantmoeSwap,
  createAgniSwap,
  createUniswapSwap,
} from "../tools";

export const getAllTools = (deps: ToolDependencies) => {
  return [
    // Pyth: price oracles
    createPythGetPrice(deps),
    createPythGetEmaPrice(deps),
    createPythGetTokenPrice(deps),
    createPythGetMultiplePrices(deps),
    createPythGetSupportedFeeds(deps),
    createPythGetSupportedTokens(deps),
    createPythFeedExists(deps),

    // Lendle: lending protocol
    createLendleBorrow(deps),
    createLendleGetPositions(deps),
    createLendleGetUserAccountData(deps),
    createLendleRepay(deps),
    createLendleSupply(deps),
    createLendleWithdraw(deps),

    // OKX: DEX aggregator
    createGetSwapQuote(deps),
    createExecuteSwap(deps),

    // mETH: liquid staking
    createGetMethTokenAddress(deps),
    createMethGetPosition(deps),
    createSwapToMeth(deps),
    createSwapFromMeth(deps),

    // 1inch: DEX aggregator
    createOneinchGetQuote(deps),
    createOneinchSwap(deps),

    // OpenOcean: DEX aggregator
    createOpenoceanGetQuote(deps),
    createOpenoceanSwap(deps),

    // Merchant Moe: Liquidity Book DEX
    createMerchantmoeSwap(deps),

    // Agni Finance: Uniswap V3 fork
    createAgniSwap(deps),

    // Uniswap V3: DEX
    createUniswapSwap(deps),
  ];
};

export const buildToolMap = (tools: StructuredToolInterface[]) => {
  return new Map(tools.map((t) => [t.name, t]));
};

export const filterToolsByNames = (
  tools: StructuredToolInterface[],
  names: string[],
) => {
  const toolMap = buildToolMap(tools);
  return names
    .map((name) => toolMap.get(name))
    .filter((t): t is StructuredToolInterface => t !== undefined);
};

export const getToolNames = (tools: StructuredToolInterface[]) => {
  return tools.map((t) => t.name);
};
