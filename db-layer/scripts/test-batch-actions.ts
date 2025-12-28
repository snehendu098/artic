/**
 * Test script for POST /actions/batch endpoint
 *
 * Run: bun run scripts/test-batch-actions.ts
 *
 * Make sure the worker is running: bun run dev
 *
 * NOTE: You need valid subscriptionId and delegationWalletId from your database
 */

const DB_LAYER_URL = "http://localhost:8788";

async function testBatchActionsEndpoint() {
  console.log("Testing POST /actions/batch endpoint...\n");

  // Test 1: Empty actions array (should fail)
  console.log("Test 1: Empty actions array");
  const res1 = await fetch(`${DB_LAYER_URL}/actions/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actions: [] }),
  });
  const data1 = await res1.json();

  console.log("Status:", res1.status);
  console.log("Response:", JSON.stringify(data1, null, 2));

  if (res1.status === 400) {
    console.log("[PASS] Returns 400 for empty actions\n");
  } else {
    console.log("[FAIL] Expected 400 status\n");
  }

  // Test 2: Valid batch of actions
  console.log("---\nTest 2: Valid batch of actions");

  // NOTE: Replace these with real IDs from your database
  const testActions = {
    actions: [
      {
        subscriptionId: "test-sub-id", // Replace with real ID
        delegationWalletId: "test-wallet-id", // Replace with real ID
        actionType: "execution",
        description: "Checked MNT price: $0.48",
        note: "Price below $0.50 threshold, triggering buy",
        status: "completed",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        subscriptionId: "test-sub-id",
        delegationWalletId: "test-wallet-id",
        actionType: "execution",
        description: "Swapped 500 USDC for 1041.67 MNT",
        note: "Bought at $0.48, target sell at $0.60 (+25%)",
        status: "completed",
        createdAt: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        subscriptionId: "test-sub-id",
        delegationWalletId: "test-wallet-id",
        actionType: "execution",
        description: "Checked MNT price: $0.61",
        note: "Price above $0.60 threshold, triggering sell",
        status: "completed",
        createdAt: new Date().toISOString(),
      },
    ],
  };

  console.log("Payload:", JSON.stringify(testActions, null, 2));
  console.log("\n");

  try {
    const res2 = await fetch(`${DB_LAYER_URL}/actions/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testActions),
    });
    const data2 = await res2.json();

    console.log("Status:", res2.status);
    console.log("Response:", JSON.stringify(data2, null, 2));

    if (res2.status === 201 && data2.success) {
      console.log(`\n[PASS] Created ${data2.data.length} actions`);
    } else {
      console.log("\n[FAIL] Failed to create actions");
      console.log("Note: Make sure subscriptionId and delegationWalletId are valid UUIDs from your database");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  // Test 3: Actions without subscriptionId (should work - subscriptionId is optional)
  console.log("\n---\nTest 3: Actions without subscriptionId");

  const actionsWithoutSub = {
    actions: [
      {
        delegationWalletId: "test-wallet-id", // Replace with real ID
        actionType: "deposit",
        description: "Deposited 100 USDC",
        note: "Initial deposit for trading",
        status: "completed",
        createdAt: new Date().toISOString(),
      },
    ],
  };

  try {
    const res3 = await fetch(`${DB_LAYER_URL}/actions/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actionsWithoutSub),
    });
    const data3 = await res3.json();

    console.log("Status:", res3.status);
    console.log("Response:", JSON.stringify(data3, null, 2));

    if (res3.status === 201) {
      console.log("\n[PASS] Created action without subscriptionId");
    } else {
      console.log("\n[INFO] Check if delegationWalletId is valid");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testBatchActionsEndpoint().catch(console.error);
