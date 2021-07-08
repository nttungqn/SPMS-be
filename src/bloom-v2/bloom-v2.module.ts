import { Module } from '@nestjs/common';
import { BloomV2Service } from './bloom-v2.service';
import { BloomV2Controller } from './bloom-v2.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloomV2Entity } from './entity/bloom-v2.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BloomV2Entity])],
  controllers: [BloomV2Controller],
  providers: [BloomV2Service]
})
export class BloomV2Module {}
