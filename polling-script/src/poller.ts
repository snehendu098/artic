import { config } from "./config";
import {
  fetchActiveSubscriptions,
  triggerExecution,
  type ActiveSubscription,
} from "./api";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(subscriptionId: string, message: string) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${subscriptionId.slice(0, 8)}] ${message}`);
}

export async function runOnce(): Promise<void> {
  console.log(`\n--- Fetching active subscriptions ---`);

  let subs: ActiveSubscription[];
  try {
    subs = await fetchActiveSubscriptions();
  } catch (err: any) {
    console.error(`Failed to fetch subscriptions: ${err.message}`);
    return;
  }

  console.log(`Found ${subs.length} active subscription(s)`);

  // Filter if specific subscription requested
  const filtered = config.SUBSCRIPTION_ID
    ? subs.filter((s) => s.subscriptionId === config.SUBSCRIPTION_ID)
    : subs;

  if (config.SUBSCRIPTION_ID && filtered.length === 0) {
    console.log(`Subscription ${config.SUBSCRIPTION_ID} not found or inactive`);
    return;
  }

  // Sequential execution
  for (const sub of filtered) {
    if (config.DRY_RUN) {
      log(sub.subscriptionId, `[DRY] ${sub.strategyName}`);
      console.log(`  Strategy: ${sub.strategyCode.slice(0, 100)}...`);
      console.log(`  Wallet: ${sub.delegationWalletAddress}`);
      console.log(`  Recent actions: ${sub.recentActions.length}`);
      continue;
    }

    try {
      log(sub.subscriptionId, `Triggering: ${sub.strategyName}`);
      const result = await triggerExecution(sub);
      log(sub.subscriptionId, result.message);
    } catch (err: any) {
      log(sub.subscriptionId, `Failed: ${err.message}`);
    }
  }
}

export async function startPolling(): Promise<void> {
  console.log(`Starting poller...`);
  console.log(`  DB Layer: ${config.DB_LAYER_URL}`);
  console.log(`  Agent Executor: ${config.AGENT_EXECUTOR_URL}`);
  console.log(`  Interval: ${config.POLL_INTERVAL_MS}ms`);
  console.log(`  Dry run: ${config.DRY_RUN}`);

  while (true) {
    await runOnce();
    console.log(`\nSleeping ${config.POLL_INTERVAL_MS}ms...`);
    await sleep(config.POLL_INTERVAL_MS);
  }
}
