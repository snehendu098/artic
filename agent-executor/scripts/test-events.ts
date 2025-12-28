/**
 * Test script for GET /events/:subscriptionId endpoint
 *
 * Run: bun run scripts/test-events.ts
 *
 * Make sure the worker is running: bun run dev
 */

export {};

interface EventsResponse {
  status: string;
  events: { type: string; data: unknown; timestamp: string }[];
}

const AGENT_EXECUTOR_URL = "http://localhost:8787";

async function testEventsEndpoint() {
  console.log("Testing GET /events/:subscriptionId endpoint...\n");

  // Test 1: Non-existent subscription (should return idle)
  console.log("Test 1: Non-existent subscription");
  const nonExistentId = "non-existent-" + Date.now();
  const res1 = await fetch(`${AGENT_EXECUTOR_URL}/events/${nonExistentId}`);
  const data1 = (await res1.json()) as EventsResponse;

  console.log("Response:", JSON.stringify(data1, null, 2));

  if (data1.status === "idle" && data1.events.length === 0) {
    console.log("[PASS] Returns idle status for non-existent subscription\n");
  } else {
    console.log("[FAIL] Expected idle status with empty events\n");
  }

  // Test 2: Trigger execution and poll for events
  console.log("---\nTest 2: Trigger execution and poll events");

  const subscriptionId = "events-test-" + Date.now();

  // Trigger execution
  const sendRes = await fetch(`${AGENT_EXECUTOR_URL}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      strategy: "Get my token balances",
      subscriptionId,
      delegationWalletId: "test-wallet",
      recentActions: [],
    }),
  });

  if (!sendRes.ok) {
    console.log("[FAIL] Failed to trigger execution");
    return;
  }

  console.log("Execution triggered, polling events...\n");

  let lastEventCount = 0;
  const maxPolls = 20;
  let pollCount = 0;

  while (pollCount < maxPolls) {
    await new Promise((r) => setTimeout(r, 500));
    pollCount++;

    const eventsRes = await fetch(`${AGENT_EXECUTOR_URL}/events/${subscriptionId}`);
    const events = (await eventsRes.json()) as EventsResponse;

    // Only log if there are new events
    if (events.events.length > lastEventCount) {
      console.log(`Poll ${pollCount}: Status=${events.status}, Events=${events.events.length}`);

      // Show new events
      for (let i = lastEventCount; i < events.events.length; i++) {
        const evt = events.events[i];
        const time = new Date(evt.timestamp).toISOString().slice(11, 19);
        console.log(`  [${time}] ${evt.type}: ${JSON.stringify(evt.data)}`);
      }

      lastEventCount = events.events.length;
    }

    if (events.status === "completed") {
      console.log("\n[PASS] Execution completed successfully");
      console.log(`Total events: ${events.events.length}`);
      break;
    }

    if (events.status === "error") {
      console.log("\n[INFO] Execution ended with error");
      console.log("Last event:", JSON.stringify(events.events[events.events.length - 1], null, 2));
      break;
    }
  }

  if (pollCount >= maxPolls) {
    console.log("\n[TIMEOUT] Max polls reached, execution may still be running");
  }

  // Test 3: Check events are cleared after some time (if flush happened)
  console.log("\n---\nTest 3: Check if events are cleared after flush");
  await new Promise((r) => setTimeout(r, 2000));

  const finalRes = await fetch(`${AGENT_EXECUTOR_URL}/events/${subscriptionId}`);
  const finalData = (await finalRes.json()) as EventsResponse;

  console.log("Final state:", JSON.stringify(finalData, null, 2));

  if (finalData.status === "idle") {
    console.log("[PASS] Events cleared after flush");
  } else {
    console.log("[INFO] Events still present (flush may have failed or is pending)");
  }
}

testEventsEndpoint().catch(console.error);
