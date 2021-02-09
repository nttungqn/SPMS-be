import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConnectionService } from './database-connection/database-connection.service';
import { ChuongTrinhDaoTaoModule } from './chuong-trinh-dao-tao/chuong-trinh-dao-tao.module';
import { AuthModule } from './auth/auth.module';
import { MonHocModule } from './mon-hoc/mon-hoc.module'

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: DatabaseConnectionService }), ChuongTrinhDaoTaoModule, AuthModule, MonHocModule],
  controllers: [AppController],
  providers: [AppService, DatabaseConnectionService]
})
export class AppModule {}
