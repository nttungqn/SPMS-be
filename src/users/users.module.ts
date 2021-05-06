import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entity/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RedisCacheModule } from 'cache/redisCache.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), RedisCacheModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
