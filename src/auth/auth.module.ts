import { CacheModule, Module } from '@nestjs/common';
import { RedisCacheModule } from 'cache/redisCache.module';
import { UsersModule } from 'users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';

@Module({
  imports: [UsersModule, CacheModule.register(), RedisCacheModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy]
})
export class AuthModule {}
