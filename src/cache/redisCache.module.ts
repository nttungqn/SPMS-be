import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from './redisCache.service';
import { REDIS_CONFIG } from 'config/config';

@Module({
  imports: [
    CacheModule.register({
      useFactory: {
        store: redisStore,
        // url: 'redis-18872.c1.ap-southeast-1-1.ec2.cloud.redislabs.com:18872',
        host: 'localhost',
        port: 6379,
        // password: REDIS_CONFIG.PASSWORD,
        ttl: 600
      }
    })
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService]
})
export class RedisCacheModule {}
