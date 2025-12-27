import * as z from "zod";
import { tool } from "langchain";
import { parseEther, erc20Abi } from "viem";
import { ToolDependencies } from "../../types/tools";
import { getTransactionReceipt } from "viem/actions";

export const createSendTransactionTool = (deps: ToolDependencies) => {
  return tool(
    async ({ to, amount, tokenAddress }) => {
      const { walletClient } = deps;

      try {
        let txHash: `0x${string}`;

        if (!tokenAddress) {
          // Native MNT transfer
          txHash = await walletClient.sendTransaction({
            to: to as `0x${string}`,
            value: parseEther(amount),
          });
        } else {
          // ERC20 token transfer
          txHash = await walletClient.writeContract({
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "transfer",
            args: [to as `0x${string}`, parseEther(amount)],
          });
        }

        const receipt = await getTransactionReceipt(walletClient, {
          hash: txHash,
        });

        return {
          success: receipt.status === "success",
          txHash,
          blockNumber: receipt.blockNumber.toString(),
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Transaction failed",
        };
      }
    },
    {
      name: "send_transaction",
      description: `Send MNT or ERC20 tokens to a wallet address`,
      schema: z.object({
        to: z
          .string()
          .describe(
            "The recipient address. Must be a valid ethereum address starting with 0x",
          ),
        amount: z
          .string()
          .describe("The amount of tokens to send (in human readable format)"),
        tokenAddress: z
          .string()
          .optional()
          .describe(
            "The ERC20 token contract address. Leave empty for native MNT transfer",
          ),
      }),
    },
  );
};
