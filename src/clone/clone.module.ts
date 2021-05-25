import { Module } from '@nestjs/common';
import { CloneService } from './clone.service';
import { CloneController } from './clone.controller';
import { PermissionModule } from 'permission/permission.module';

@Module({
  controllers: [CloneController],
  providers: [CloneService],
  imports: [PermissionModule]
})
export class CloneModule {}
