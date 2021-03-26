import { Module } from '@nestjs/common';
import { SoKhopService } from './so-khop.service';
import { SoKhopController } from './so-khop.controller';

@Module({
  controllers: [SoKhopController],
  providers: [SoKhopService]
})
export class SoKhopModule {}
