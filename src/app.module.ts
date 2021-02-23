import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConnectionService } from './database-connection/database-connection.service';
import { ChuongTrinhDaoTaoModule } from './chuong-trinh-dao-tao/chuong-trinh-dao-tao.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { bodyValidatorMiddleware } from 'auth/middlewares/body-validator.middleware';
import { MonHocModule} from './mon-hoc/mon-hoc.module'
import { CtdtModule } from './ctdt/ctdt.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: DatabaseConnectionService }),
    ChuongTrinhDaoTaoModule,
    AuthModule,
    UsersModule,
    MonHocModule,
    CtdtModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseConnectionService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(bodyValidatorMiddleware).forRoutes('auth/login', 'auth/signup');
  }
}
