import { Module } from '@nestjs/common';
import { PermissionModule } from 'permission/permission.module';
import { UsersModule } from 'users/users.module';
import { UploadFileController } from './upload-file.controller';
import { UploadFileService } from './upload-file.service';

@Module({
  controllers: [UploadFileController],
  providers: [UploadFileService],
  imports: [UsersModule, PermissionModule]
})
export class UploadFileModule {}
