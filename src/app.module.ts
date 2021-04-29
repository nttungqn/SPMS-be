import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConnectionService } from './database-connection/database-connection.service';
import { ChuongTrinhDaoTaoModule } from './chuong-trinh-dao-tao/chuong-trinh-dao-tao.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { bodyValidatorMiddleware } from 'auth/middlewares/body-validator.middleware';
import { SyllabusModule } from './syllabus/syllabus.module';
import { NamHocModule } from './nam-hoc/nam-hoc.module';
import { HeDaotaoModule } from './he-dao-tao/he-dao-tao.module';
import { MonHocModule } from './mon-hoc/mon-hoc.module';
import { CtdtModule } from './ctdt/ctdt.module';
import { MonHocTienQuyetModule } from './mon-hoc-tien-quyet/mon-hoc-tien-quyet.module';
import { ChiTietNganhDaoTaoModule } from './chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.module';
import { KeHoachGiangDayModule } from './ke-hoach-giang-day/ke-hoach-giang-day.module';
import { KhoiKIenThucModule } from './khoi-kien-thuc/khoi-kien-thuc.module';
import { LoaiKeHoachGiangDayModule } from './loai-ke-hoach-giang-day/loai-ke-hoach-giang-day.module';
import { ChuanDauRaModule } from './chuan-dau-ra/chuan-dau-ra.module';
import { ChuanDauRaNganhDaoTaoModule } from './chuan-dau-ra-nganh-dao-tao/chuan-dau-ra-nganh-dao-tao.module';
import { LoaiKhoiKienThucModule } from './loai-khoi-kien-thuc/loai-khoi-kien-thuc.module';
import { ChuDeModule } from './chu-de/chu-de.module';
import { HoatDongDayHocModule } from './hoat-dong-day-hoc/hoat-dong-day-hoc.module';
import { LoaiDanhGiaModule } from './loai-danh-gia/loai-danh-gia.module';
import { GomNhomModule } from './gom-nhom/gom-nhom.module';
import { ChiTietGomNhomModule } from './chi-tiet-gom-nhom/chi-tiet-gom-nhom.module';
import { MucTieuMonHocModule } from './muc-tieu-mon-hoc/muc-tieu-mon-hoc.module';
import { ChiTietKeHoachModule } from './chi-tiet-ke-hoach/chi-tiet-ke-hoach.module';
import { ChuanDauRaMonHocModule } from './chuan-dau-ra-mon-hoc/chuan-dau-ra-mon-hoc.module';
import { HoatDongDanhGiaModule } from './hoat-dong-danh-gia/hoat-dong-danh-gia.module';
import { SoKhopModule } from './so-khop/so-khop.module';
import { RolesModule } from 'roles/roles.module';
import { ExportsModule } from './exports/exports.module';
import { UploadFileModule } from './upload-file/upload-file.module';
import { ThongKeModule } from './thong-ke/thong-ke.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: DatabaseConnectionService }),
    ChuongTrinhDaoTaoModule,
    AuthModule,
    UsersModule,
    MonHocModule,
    SyllabusModule,
    NamHocModule,
    HeDaotaoModule,
    CtdtModule,
    MonHocTienQuyetModule,
    ChiTietNganhDaoTaoModule,
    KeHoachGiangDayModule,
    KhoiKIenThucModule,
    LoaiKeHoachGiangDayModule,
    ChuanDauRaModule,
    ChuanDauRaNganhDaoTaoModule,
    LoaiKhoiKienThucModule,
    ChuDeModule,
    HoatDongDayHocModule,
    LoaiDanhGiaModule,
    GomNhomModule,
    ChiTietGomNhomModule,
    MucTieuMonHocModule,
    ChiTietKeHoachModule,
    ChuanDauRaMonHocModule,
    HoatDongDanhGiaModule,
    CacheModule.register(),
    SoKhopModule,
    RolesModule,
    UsersModule,
    ExportsModule,
    UploadFileModule,
    UploadFileModule,
    ThongKeModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseConnectionService, CronService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(bodyValidatorMiddleware).forRoutes('auth/login', 'auth/signup');
  }
}
