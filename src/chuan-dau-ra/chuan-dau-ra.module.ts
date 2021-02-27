import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChuanDauRaController } from './chuan-dau-ra.controller';
import { ChuanDauRaService } from './chuan-dau-ra.service';
import { ChuanDauRaEntity } from './entity/chuanDauRa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChuanDauRaEntity])],
  controllers: [ChuanDauRaController],
  providers: [ChuanDauRaService]
})
export class ChuanDauRaModule {}
