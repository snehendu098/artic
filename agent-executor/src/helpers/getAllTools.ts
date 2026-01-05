import { StructuredToolInterface } from "@langchain/core/tools";
import { ToolDependencies } from "../types/tools";
import {
  createGetBalanceTool,
  createTransferTool,
  createOkxSwapTool,
  createOneInchSwapTool,
  createOpenOceanSwapTool,
  createUniswapSwapTool,
  createAgniSwapTool,
  createMerchantMoeSwapTool,
  createLendleSupplyTool,
  createLendleWithdrawTool,
  createLendleBorrowTool,
  createLendleRepayTool,
  createCrossChainSwapTool,
  createApproveTokenTool,
  createCheckAllowanceTool,
} from "../tools/mantle";

export const getAllTools = (deps: ToolDependencies) => {
  return [
    // Utility
    createGetBalanceTool(deps),
    createApproveTokenTool(deps),
    createCheckAllowanceTool(deps),
    // Transfer
    createTransferTool(deps),
    // Swaps
    createOkxSwapTool(deps),
    createOneInchSwapTool(deps),
    createOpenOceanSwapTool(deps),
    createUniswapSwapTool(deps),
    createAgniSwapTool(deps),
    createMerchantMoeSwapTool(deps),
    // Lendle
    createLendleSupplyTool(deps),
    createLendleWithdrawTool(deps),
    createLendleBorrowTool(deps),
    createLendleRepayTool(deps),
    // Cross-chain
    createCrossChainSwapTool(deps),
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
