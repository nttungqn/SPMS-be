import { Module } from '@nestjs/common';
import { BloomService } from './bloom.service';
import { BloomController } from './bloom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloomEntity } from './entity/bloom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BloomEntity])],
  controllers: [BloomController],
  providers: [BloomService]
})
export class BloomModule {}
