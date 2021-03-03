import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GomNhomService } from './gom-nhom.service';
import { GomNhomController } from './gom-nhom.controller';
import { GomNhomEntity } from './entity/gom-nhom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GomNhomEntity])],
  providers: [GomNhomService],
  controllers: [GomNhomController],
  exports: [GomNhomService]
})
export class GomNhomModule {}
