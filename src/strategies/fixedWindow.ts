//Janela começa

//Contador sobe

//Se passou do limite → bloqueia

//Quando TTL expira → zera
import { RateLimitOptions, RateLimitResult, RateLimitState, RateLimiteStorage } from "../types";
import { Storage } from "../storage/storage";
export class FixedWindowStrategy {
    private storage: RateLimiteStorage;
    private maxRequests: number;
    private interval: number;
    constructor(options: RateLimitOptions) {
        this.storage = options.storage!;
        this.maxRequests = options.maxRequests || 100; // padrão 100 requisições
        this.interval = options.interval || 60000; // padrão 1 minuto
    }
    async isRateLimited(key: string): Promise<RateLimitResult> {
        const now = Date.now();
        let state = await this.storage.get(key);
        if (!state || now >= state.resetAt) {
            state = { count: 1, resetAt: now + this.interval };
        }
        else {
            state.count += 1;
        }

        await this.storage.set(key, state, state.resetAt - now);
        const remaining = Math.max(this.maxRequests - state.count, 0);
        return {
            limit: this.maxRequests,
            remaining,
            reset: state.resetAt,
            used: state.count,
        };
    }
    async resetRateLimit(key: string): Promise<void> {
        await this.storage.delete(key);
    }
    async getRateLimit(key: string): Promise<RateLimitResult | null> {
        const state = await this.storage.get(key); 
        if (!state) {
            return null;
        }
        const now = Date.now();

        const remaining = Math.max(this.maxRequests - state.count, 0);
        return {
            limit: this.maxRequests,
            remaining,
            reset: state.resetAt,
            used: state.count,
        };
    }
}