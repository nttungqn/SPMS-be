import { Module } from '@nestjs/common';
import { ChuanDauRaMonHocService } from './chuan-dau-ra-mon-hoc.service';
import { ChuanDauRaMonHocController } from './chuan-dau-ra-mon-hoc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChuanDauRaMonHocEntity } from './entity/chuan-dau-ra-mon-hoc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChuanDauRaMonHocEntity])],
  controllers: [ChuanDauRaMonHocController],
  providers: [ChuanDauRaMonHocService]
})
export class ChuanDauRaMonHocModule {}
