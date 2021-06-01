import { Module } from '@nestjs/common';
import { CloneService } from './clone.service';
import { CloneController } from './clone.controller';
import { PermissionModule } from 'permission/permission.module';
import { ChiTietGomNhomModule } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.module';

@Module({
  controllers: [CloneController],
  providers: [CloneService],
  imports: [PermissionModule, ChiTietGomNhomModule],
  exports: [CloneService]
})
export class CloneModule {}
