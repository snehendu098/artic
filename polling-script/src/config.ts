export interface Config {
  DB_LAYER_URL: string;
  AGENT_EXECUTOR_URL: string;
  BOT_API_KEY: string;
  POLL_INTERVAL_MS: number;
  MODE: "poll" | "once";
  DRY_RUN: boolean;
  SUBSCRIPTION_ID?: string;
}

function parseArgs(): Partial<Config> {
  const args = process.argv.slice(2);
  const parsed: Partial<Config> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--once") {
      parsed.MODE = "once";
    } else if (arg === "--dry-run") {
      parsed.DRY_RUN = true;
    } else if (arg.startsWith("--subscription-id=")) {
      parsed.SUBSCRIPTION_ID = arg.split("=")[1];
    } else if (arg.startsWith("--interval=")) {
      parsed.POLL_INTERVAL_MS = parseInt(arg.split("=")[1], 10);
    }
  }

  return parsed;
}

export function loadConfig(): Config {
  const args = parseArgs();

  const config: Config = {
    DB_LAYER_URL: process.env.DB_LAYER_URL || "http://localhost:8788",
    AGENT_EXECUTOR_URL:
      process.env.AGENT_EXECUTOR_URL || "http://localhost:8787",
    BOT_API_KEY: process.env.BOT_API_KEY || "",
    POLL_INTERVAL_MS: args.POLL_INTERVAL_MS || 60000,
    MODE: args.MODE || "poll",
    DRY_RUN: args.DRY_RUN || false,
    SUBSCRIPTION_ID: args.SUBSCRIPTION_ID,
  };

  if (!config.BOT_API_KEY) {
    console.error("BOT_API_KEY is required");
    process.exit(1);
  }

  return config;
}

export const config = loadConfig();
