// TTLs in seconds
export const TTL = {
  USER: 3600,
  DELEGATIONS: 3600,
  MARKETPLACE: 300,
  MY_STRATEGIES: 600,
  PURCHASES: 1800,
  SUBSCRIPTIONS: 300,
  SUBSCRIBERS: 300,
  ACTIONS: 120,
  EARNINGS: 600,
} as const;

// Cache key generators
export const CacheKeys = {
  user: (wallet: string) => `artic:user:${wallet.toLowerCase()}`,
  delegations: (wallet: string) => `artic:delegations:${wallet.toLowerCase()}`,
  marketplace: () => `artic:strategies:marketplace`,
  myStrategies: (wallet: string) =>
    `artic:strategies:mine:${wallet.toLowerCase()}`,
  purchases: (wallet: string) => `artic:purchases:${wallet.toLowerCase()}`,
  subscriptions: (wallet: string) =>
    `artic:subscriptions:${wallet.toLowerCase()}`,
  subscribers: (wallet: string) => `artic:subscribers:${wallet.toLowerCase()}`,
  actions: (wallet: string, limit?: number) =>
    `artic:actions:${wallet.toLowerCase()}${limit ? `:limit:${limit}` : ""}`,
  earnings: (wallet: string) => `artic:earnings:${wallet.toLowerCase()}`,
  botActive: () => `artic:bot:active-subscriptions`,
};

// Get from cache
export async function cacheGet<T>(
  kv: KVNamespace,
  key: string
): Promise<T | null> {
  const cached = await kv.get(key, "json");
  return cached as T | null;
}

// Set to cache
export async function cacheSet<T>(
  kv: KVNamespace,
  key: string,
  value: T,
  ttl: number
): Promise<void> {
  await kv.put(key, JSON.stringify(value), { expirationTtl: ttl });
}

// Delete multiple keys
export async function cacheDelete(
  kv: KVNamespace,
  keys: string[]
): Promise<void> {
  await Promise.all(keys.map((key) => kv.delete(key)));
}

// Get from cache or fetch + cache
export async function cached<T>(
  kv: KVNamespace,
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const hit = await cacheGet<T>(kv, key);
  if (hit !== null) return hit;

  const data = await fetcher();
  if (data !== null && data !== undefined) {
    await cacheSet(kv, key, data, ttl);
  }
  return data;
}
