import { tool } from "langchain";
import { ToolDependencies } from "../../types";
import z from "zod";
import { Address } from "viem";
import { sendTransaction } from "mantle-agent-kit-sdk";

export const createTransferTool = (deps: ToolDependencies) => {
  return tool(
    async ({ to, amount, tokenAddress }) => {
      const { mntAgentKit, eventLogger } = deps;

      await eventLogger.emit({
        type: "tool_call",
        data: { tool: "transfer", args: { to, amount, tokenAddress } },
      });

      try {
        const result = await sendTransaction(
          mntAgentKit,
          to as Address,
          amount,
          tokenAddress as Address | undefined
        );

        const tokenType = tokenAddress ? "ERC20" : "MNT";

        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "transfer",
            result: `Sent ${amount} ${tokenType} to ${to}`,
            note: `txHash: ${result.transactionHash}`,
          },
        });

        return {
          success: true,
          txHash: result.transactionHash,
          blockNumber: result.blockNumber,
        };
      } catch (err: any) {
        await eventLogger.emit({
          type: "tool_result",
          data: {
            tool: "transfer",
            result: `Failed to transfer: ${err.message}`,
            note: err.message,
          },
        });
        return { success: false, error: err.message };
      }
    },
    {
      name: "transfer",
      description:
        "Send native MNT or ERC20 tokens to a recipient. Omit tokenAddress for native MNT.",
      schema: z.object({
        to: z.string().describe("Recipient address"),
        amount: z.string().describe("Amount to send (human readable, e.g. '1.5')"),
        tokenAddress: z
          .string()
          .optional()
          .describe("ERC20 token address. Omit for native MNT"),
      }),
    }
  );
};
