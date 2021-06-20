import { Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache, Store } from 'cache-manager';
import { REDIS_CONFIG } from 'config/config';

export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @Inject(CACHE_MANAGER) private readonly store: Store
  ) {}

  async get(key): Promise<any> {
    return undefined;
    // return await this.cache.get(key);
  }

  async set(key, value, ttl = REDIS_CONFIG.TTL) {
    return undefined;
    // await this.cache.set(key, value, { ttl });
  }

  async reset() {
    await this.cache.reset();
  }

  async del(key) {
    await this.cache.del(key);
  }

  async keys() {
    return await this.store.keys();
  }

  async delCacheList(commonKey: string[]) {
    const allKey = await this.store.keys();
    const map = [];
    allKey.forEach((e, _) => {
      commonKey.forEach((value, i) => {
        if (e.includes(value.replace(/{}/g, ''))) map.push(e);
      });
    });
    if (map.length > 0) await this.store.del(map);
  }

  async getKeyForgotPassword(key): Promise<any> {
    return await this.store.get(key);
  }

  async setKeyForgotPassword(key, value, ttl = REDIS_CONFIG.TTL) {
    await this.store.set(key, value, { ttl });
  }
}
