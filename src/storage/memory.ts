import { createCache } from "node-cache-lite";
import { RateLimiteStorage, RateLimitState } from "../types";

// Implementação em memória usando node-cache-lite
export class MemoryStorage implements RateLimiteStorage {
  private cache: ReturnType<typeof createCache>;

  constructor() {
    this.cache = createCache();
  }

  async get(key: string): Promise<RateLimitState | null> {
    const value = this.cache.get(key) as RateLimitState | undefined;
    return value ?? null;
  }

  async set(
    key: string,
    value: RateLimitState,
    ttl: number
  ): Promise<void> {
    // node-cache-lite usa TTL em MILISSEGUNDOS
    this.cache.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
}
