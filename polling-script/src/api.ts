import { config } from "./config";

export interface RecentAction {
  id: string;
  actionType: string;
  description: string;
  note: string | null;
  createdAt: Date | null;
}

export interface ActiveSubscription {
  subscriptionId: string;
  strategyId: string;
  strategyCode: string;
  strategyName: string;
  userId: string;
  userWallet: string;
  delegationWalletId: string;
  delegationWalletAddress: string;
  encryptedPrivateKey: string; // Actually decrypted by db-layer
  recentActions: RecentAction[];
}

export async function fetchActiveSubscriptions(): Promise<
  ActiveSubscription[]
> {
  const res = await fetch(`${config.DB_LAYER_URL}/bot/active-subscriptions`, {
    headers: {
      "x-api-key": config.BOT_API_KEY,
    },
  });

  console.log(res.body);

  if (!res.ok) {
    throw new Error(`Failed to fetch subscriptions: ${res.status}`);
  }

  const data: any = await res.json();
  return data.data || [];
}

export interface TriggerResult {
  success: boolean;
  message: string;
}

export async function triggerExecution(
  sub: ActiveSubscription,
): Promise<TriggerResult> {
  const res = await fetch(`${config.AGENT_EXECUTOR_URL}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      privateKey: sub.encryptedPrivateKey,
      strategy: sub.strategyCode,
      subscriptionId: sub.subscriptionId,
      delegationWalletId: sub.delegationWalletId,
      recentActions: sub.recentActions,
    }),
  });

  const data = (await res.json()) as TriggerResult;
  return data;
}

export interface EventsState {
  status: "idle" | "running" | "completed" | "error";
  events: Array<{ type: string; data: any; timestamp: number }>;
}

export async function pollEvents(subscriptionId: string): Promise<EventsState> {
  const res = await fetch(
    `${config.AGENT_EXECUTOR_URL}/events/${subscriptionId}`,
  );
  return (await res.json()) as EventsState;
}
