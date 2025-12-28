import * as z from "zod";
import { tool } from "langchain";
import { parseEther, erc20Abi } from "viem";
import { ToolDependencies } from "../../types/tools";
import { getTransactionReceipt } from "viem/actions";

export const createSendTransactionTool = (deps: ToolDependencies) => {
  return tool(
    async ({ to, amount, tokenAddress }) => {
      const { walletClient, eventLogger } = deps;
      const tokenType = tokenAddress ? "ERC20" : "MNT";

      await eventLogger.emit({
        type: "tool_call",
        data: {
          tool: "send_transaction",
          args: { to, amount, tokenAddress },
        },
      });

      try {
        let txHash: `0x${string}`;

        if (!tokenAddress) {
          txHash = await walletClient.sendTransaction({
            to: to as `0x${string}`,
            value: parseEther(amount),
          });
        } else {
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

        const success = receipt.status === "success";
        const shortTo = `${to.slice(0, 6)}...${to.slice(-4)}`;

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "send_transaction",
            result: `Sent ${amount} ${tokenType} to ${shortTo}`,
            note: success
              ? `Transaction confirmed in block ${receipt.blockNumber}`
              : "Transaction failed",
          },
        });

        return {
          success,
          txHash,
          blockNumber: receipt.blockNumber.toString(),
        };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Transaction failed";

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "send_transaction",
            result: `Failed to send ${amount} ${tokenType}`,
            note: errorMsg,
          },
        });

        return { success: false, error: errorMsg };
      }
    },
    {
      name: "send_transaction",
      description: `Send MNT or ERC20 tokens to a wallet address`,
      schema: z.object({
        to: z
          .string()
          .describe(
            "The recipient address. Must be a valid ethereum address starting with 0x"
          ),
        amount: z
          .string()
          .describe("The amount of tokens to send (in human readable format)"),
        tokenAddress: z
          .string()
          .optional()
          .describe(
            "The ERC20 token contract address. Leave empty for native MNT transfer"
          ),
      }),
    }
  );
};
