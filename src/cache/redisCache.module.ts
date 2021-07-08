import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { REDIS_CONFIG } from 'config/config';
import { RedisCacheService } from './redisCache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        return REDIS_CONFIG.PASSWORD
          ? {
              store: redisStore,
              host: REDIS_CONFIG.HOST,
              port: REDIS_CONFIG.PORT,
              password: REDIS_CONFIG.PASSWORD,

              ttl: REDIS_CONFIG.TTL,
              max: REDIS_CONFIG.MAX
            }
          : {
              store: redisStore,
              host: REDIS_CONFIG.HOST,
              port: REDIS_CONFIG.PORT,
              ttl: REDIS_CONFIG.TTL,
              max: REDIS_CONFIG.MAX
            };
      }
    })
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService]
})
export class RedisCacheModule {}
