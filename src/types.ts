
export interface RateLimitResult {
    limit: number;
    remaining: number;
    reset: number;
    used: number;
}
//definindo
//RateLimitOptions

export interface RateLimitOptions {
    maxRequests?: number;
    interval?: number;
    storage?: RateLimiteStorage;
}


export interface RateLimiteStorage {
    get(key: string): Promise<RateLimitState | null>;
    set(key: string, value: RateLimitState, ttl: number): Promise<void>;
    delete(key: string): Promise<void>;
}


export interface RateLimiter {
    isRateLimited(key: string): Promise<RateLimitResult>;
    resetRateLimit(key: string): Promise<void>;
    getRateLimit(key: string): Promise<RateLimitResult | null>;
}


export interface RateLimitState {
  count: number;
  resetAt: number;
}

export interface limiterConfig {
    strategy: 'fixedWindow' | 'slidingWindow';
    options: RateLimitOptions;
}

