import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from './entity/permission.entity';
import { RolesModule } from 'roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity]), RolesModule],
  controllers: [PermissionController],
  providers: [PermissionService]
})
export class PermissionModule {}
