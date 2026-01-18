import { RateLimitState } from '../types';

export interface Storage {
    get(key: string): Promise<RateLimitState | null>;
    set(key: string, value: RateLimitState, ttl: number): Promise<void>;
    delete(key: string): Promise<void>;
}

