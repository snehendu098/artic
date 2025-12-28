/**
 * Test script for POST /send endpoint
 *
 * Run: bun run scripts/test-send.ts
 *
 * Make sure the worker is running: bun run dev
 */

export {};

const AGENT_EXECUTOR_URL = "http://localhost:8787";

async function testSendEndpoint() {
  console.log("Testing POST /send endpoint...\n");

  const testPayload = {
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Test key - don't use in production
    strategy: "Check my token balances and swap 10 USDC to MNT if balance is sufficient",
    subscriptionId: "test-sub-" + Date.now(),
    delegationWalletId: "test-wallet-123",
    recentActions: [
      {
        id: "action-1",
        actionType: "execution",
        description: "Previous swap completed",
        note: "Swapped 50 USDC for MNT",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  };

  console.log("Payload:", JSON.stringify(testPayload, null, 2));
  console.log("\n---\n");

  try {
    const response = await fetch(`${AGENT_EXECUTOR_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    });

    const data = (await response.json()) as { success: boolean; message: string };

    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log("\n[PASS] /send endpoint returned success");
      console.log("\nNow poll /events/" + testPayload.subscriptionId + " to see real-time events");

      // Poll for events for 5 seconds
      console.log("\nPolling events for 5 seconds...\n");
      const startTime = Date.now();
      while (Date.now() - startTime < 5000) {
        await new Promise((r) => setTimeout(r, 500));
        const eventsRes = await fetch(
          `${AGENT_EXECUTOR_URL}/events/${testPayload.subscriptionId}`
        );
        const events = (await eventsRes.json()) as { status: string; events?: unknown[] };
        console.log(`[${new Date().toISOString()}] Status: ${events.status}, Events: ${events.events?.length || 0}`);

        if (events.status === "completed" || events.status === "error") {
          console.log("\nFinal events:");
          console.log(JSON.stringify(events, null, 2));
          break;
        }
      }
    } else {
      console.log("\n[FAIL] /send endpoint failed");
    }

    // Test duplicate prevention
    console.log("\n---\nTesting duplicate prevention...\n");

    // First, manually set status to running in KV to simulate ongoing execution
    const dupePayload = { ...testPayload, subscriptionId: "dupe-test-" + Date.now() };

    // First request
    const res1 = await fetch(`${AGENT_EXECUTOR_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dupePayload),
    });
    console.log("First request status:", res1.status);

    // Immediate second request (should fail with 409)
    const res2 = await fetch(`${AGENT_EXECUTOR_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dupePayload),
    });
    console.log("Second request status:", res2.status);

    if (res2.status === 409) {
      console.log("[PASS] Duplicate prevention working - got 409 Conflict");
    } else {
      console.log("[WARN] Expected 409 but got", res2.status);
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

testSendEndpoint();
