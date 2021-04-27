import { Module } from '@nestjs/common';
import { UsersModule } from 'users/users.module';
import { UploadFileController } from './upload-file.controller';
import { UploadFileService } from './upload-file.service';

@Module({
  controllers: [UploadFileController],
  providers: [UploadFileService],
  imports: [UsersModule]
})
export class UploadFileModule {}
