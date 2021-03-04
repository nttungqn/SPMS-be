import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChiTietGomNhomEntity } from './entity/chi-tiet-gom-nhom.entity';
import { ChiTietGomNhomService } from './chi-tiet-gom-nhom.service';
import { ChiTietGomNhomController } from './chi-tiet-gom-nhom.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChiTietGomNhomEntity])],
  providers: [ChiTietGomNhomService],
  controllers: [ChiTietGomNhomController],
  exports: [ChiTietGomNhomService]
})
export class ChiTietGomNhomModule {}
