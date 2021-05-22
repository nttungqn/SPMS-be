import { forwardRef, Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceEntity } from './entity/resource.entity';
import { RolesModule } from 'roles/roles.module';
import { PermissionModule } from 'permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceEntity]), forwardRef(() => RolesModule), PermissionModule],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService]
})
export class ResourcesModule {}
