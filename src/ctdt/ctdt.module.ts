import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CtdtController } from './ctdt.controller';
import { CtdtService } from './ctdt.service';
import { NganhDaoTaoEntity } from './entity/nganhDaoTao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NganhDaoTaoEntity])],
  controllers: [CtdtController],
  providers: [CtdtService]
})
export class CtdtModule {}
