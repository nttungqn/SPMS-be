import { Module } from '@nestjs/common';
import { CloneService } from './clone.service';
import { CloneController } from './clone.controller';
import { RolesModule } from 'roles/roles.module';

@Module({
  controllers: [CloneController],
  providers: [CloneService],
  imports: [RolesModule]
})
export class CloneModule {}
