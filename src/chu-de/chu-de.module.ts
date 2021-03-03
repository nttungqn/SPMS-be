import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChuDeController } from './chu-de.controller';
import { ChuDeService } from './chu-de.service';
import { ChuDeEntity } from './entity/chu-de.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChuDeEntity])],
  controllers: [ChuDeController],
  providers: [ChuDeService],
  exports: [ChuDeService]
})
export class ChuDeModule {}
