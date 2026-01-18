//Receber config
import { limiterConfig } from './types';
import { Storage } from './storage/storage';
import { RateLimiter } from './types';
import { FixedWindowStrategy } from './strategies/fixedWindow';
import { SlidingWindowStrategy } from './strategies/slidingWindow';
//Escolher estratégia
export class RateLimiterFactory {
  static create(
    config: limiterConfig,
    storage: Storage 
  ): RateLimiter {
    const options = {
      ...config.options,
      storage,
    };

    switch (config.strategy) {
      case 'fixedWindow':
        return new FixedWindowStrategy(options);

      case 'slidingWindow':
        return new SlidingWindowStrategy(options);

      default:
        throw new Error(`Unknown rate limit strategy: ${config.strategy}`);
    }
  }
}
