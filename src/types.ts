//definindo 
//RateLimitResult
export interface RateLimitResult {
    limit: number; // número máximo de solicitações permitidas
    remaining: number; // número de solicitações restantes
    reset: number; // timestamp de quando o limite será redefinido
    used: number; // número de solicitações já usadas
}
//definindo
//RateLimitOptions

export interface RateLimitOptions {
    maxRequests?: number; // número máximo de solicitações permitidas
    interval?: number; // janela de tempo em milissegundos para o limite
    storage?: RateLimiteStorage; // mensagem opcional para quando o limite for atingido
}

// definindo
//ratLimitStorage
export interface RateLimiteStorage {
    get(key: string): Promise<RateLimitState | null>;
    set(key: string, value: RateLimitState, ttl: number): Promise<void>;
    delete(key: string): Promise<void>;
}

//definindo
//RateLimiter
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

//definindo
//Exportando RateLimitOptions