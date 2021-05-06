import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { REDIS_CONFIG } from 'config/config';
import { RedisCacheService } from './redisCache.service';

@Module({
  imports: [
    CacheModule.register({
      useFactory: {
        store: redisStore,

        // remote: https://redislabs.com/
        url: REDIS_CONFIG.URL,
        password: REDIS_CONFIG.PASSWORD,

        // local: http://localhost:6379
        // host: REDIS_CONFIG.HOST,
        // port: REDIS_CONFIG.PORT,

        ttl: REDIS_CONFIG.TTL,
        max: REDIS_CONFIG.MAX
      }
    })
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService]
})
export class RedisCacheModule {}
