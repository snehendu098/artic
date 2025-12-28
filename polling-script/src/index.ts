import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import { config } from "./config";
import { runOnce, startPolling } from "./poller";

async function main() {
  if (config.MODE === "once") {
    await runOnce();
    console.log("\nDone.");
  } else {
    await startPolling();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
