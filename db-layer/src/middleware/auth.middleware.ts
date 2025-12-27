import { Context, Next } from "hono";
import { Env } from "../types";

export const requireApiKey = async (c: Context<Env>, next: Next) => {
  const apiKey = c.req.header("X-API-Key");
  const validApiKey = c.env.BOT_API_KEY;

  console.log(apiKey, validApiKey);

  if (!apiKey || apiKey !== validApiKey) {
    return c.json(
      {
        success: false,
        message: "Unauthorized: Invalid or missing API key",
        data: null,
      },
      401,
    );
  }

  await next();
};
