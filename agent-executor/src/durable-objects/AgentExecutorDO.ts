import { DurableObject } from "cloudflare:workers";
import { Agent } from "../agent";
import { EventLogger, EventsState } from "../helpers/EventLogger";
import { formatActions, RecentAction } from "../helpers/formatActions";
import { KVNamespace } from "@cloudflare/workers-types";

export interface ExecuteRequest {
  privateKey: string;
  strategy: string;
  subscriptionId: string;
  delegationWalletId: string;
  recentActions: RecentAction[];
  strategyId?: string;
  strategyName?: string;
  walletAddress?: string;
}

interface Env {
  EVENTS: KVNamespace;
  GROQ_API_KEY: string;
  DB_LAYER_URL: string;
}

export class AgentExecutorDO extends DurableObject<Env> {
  async execute(request: ExecuteRequest): Promise<{ success: boolean; message: string }> {
    const {
      privateKey,
      strategy,
      subscriptionId,
      delegationWalletId,
      recentActions,
      walletAddress,
    } = request;

    const eventLogger = new EventLogger(
      this.env.EVENTS,
      subscriptionId,
      delegationWalletId,
      this.env.DB_LAYER_URL,
    );

    try {
      const agent = new Agent(
        privateKey as `0x${string}`,
        this.env.GROQ_API_KEY,
        eventLogger,
      );

      await agent.execute(strategy, formatActions(recentActions));
      await eventLogger.setStatus("completed");
      await eventLogger.flush();

      // Clear wallet execution tracking
      if (walletAddress) {
        await this.env.EVENTS.delete(`execution:${walletAddress}`);
      }

      return { success: true, message: "Execution completed" };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";

      await eventLogger.emit({
        type: "error",
        data: { error: errorMessage, note: "Strategy execution failed" },
      });
      await eventLogger.setStatus("error");
      await eventLogger.flush();

      // Clear wallet execution tracking
      if (walletAddress) {
        await this.env.EVENTS.delete(`execution:${walletAddress}`);
      }

      return { success: false, message: errorMessage };
    }
  }
}
