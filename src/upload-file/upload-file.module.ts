import { Module } from '@nestjs/common';
import { RolesModule } from 'roles/roles.module';
import { UsersModule } from 'users/users.module';
import { UploadFileController } from './upload-file.controller';
import { UploadFileService } from './upload-file.service';

@Module({
  controllers: [UploadFileController],
  providers: [UploadFileService],
  imports: [UsersModule, RolesModule]
})
export class UploadFileModule {}
