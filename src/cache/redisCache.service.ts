import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { REDIS_CONFIG } from 'config/config';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key): Promise<any> {
    return await this.cache.get(key);
  }

  async set(key, value, ttl = REDIS_CONFIG.TTL) {
    await this.cache.set(key, value, { ttl });
  }

  async reset() {
    await this.cache.reset();
  }

  async del(key) {
    await this.cache.del(key);
  }
}
