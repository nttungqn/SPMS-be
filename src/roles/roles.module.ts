import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesEntity } from './entity/roles.entity';
import { RolesController } from './role.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity])],
  providers: [RolesService],
  controllers: [RolesController]
})
export class RolesModule {}
