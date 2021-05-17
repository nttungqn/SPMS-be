import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { REDIS_CONFIG } from 'config/config';
import { RedisCacheService } from './redisCache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,

        // remote: https://redislabs.com/
        host: REDIS_CONFIG.HOST,
        port: REDIS_CONFIG.PORT,
        password: REDIS_CONFIG.PASSWORD,

        ttl: REDIS_CONFIG.TTL,
        max: REDIS_CONFIG.MAX
      })
    })
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService]
})
export class RedisCacheModule {}
