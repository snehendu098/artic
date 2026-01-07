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
