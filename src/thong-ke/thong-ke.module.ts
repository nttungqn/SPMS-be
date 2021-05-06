import { Module } from '@nestjs/common';
import { ThongKeService } from './thong-ke.service';
import { ThongKeController } from './thong-ke.controller';
import { SyllabusModule } from 'syllabus/syllabus.module';
import { ChuongTrinhDaoTaoModule } from 'chuong-trinh-dao-tao/chuong-trinh-dao-tao.module';
import { CtdtModule } from 'ctdt/ctdt.module';
import { UsersModule } from 'users/users.module';
import { RedisCacheModule } from 'cache/redisCache.module';

@Module({
  controllers: [ThongKeController],
  providers: [ThongKeService],
  imports: [SyllabusModule, ChuongTrinhDaoTaoModule, CtdtModule, UsersModule, RedisCacheModule]
})
export class ThongKeModule {}
