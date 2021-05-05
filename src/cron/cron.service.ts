import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { ChiTietGomNhomService } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.service';
import { ChiTietKeHoachService } from 'chi-tiet-ke-hoach/chi-tiet-ke-hoach.service';
import { ChiTietNganhDaoTaoService } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.service';
import { ChuDeService } from 'chu-de/chu-de.service';
import { ChuanDauRaMonHocService } from 'chuan-dau-ra-mon-hoc/chuan-dau-ra-mon-hoc.service';
import { ChuanDauRaNganhDaoTaoService } from 'chuan-dau-ra-nganh-dao-tao/chuan-dau-ra-nganh-dao-tao.service';
import { ChuanDauRaService } from 'chuan-dau-ra/chuan-dau-ra.service';
import { ChuongTrinhDaoTaoService } from 'chuong-trinh-dao-tao/chuong-trinh-dao-tao.service';
import { GomNhomService } from 'gom-nhom/gom-nhom.service';
import { HeDaotaoService } from 'he-dao-tao/he-dao-tao.service';
import { HoatDongDanhGiaService } from 'hoat-dong-danh-gia/hoat-dong-danh-gia.service';
import { HoatDongDayHocService } from 'hoat-dong-day-hoc/hoat-dong-day-hoc.service';
import { KeHoachGiangDayService } from 'ke-hoach-giang-day/ke-hoach-giang-day.service';
import { KhoiKienThucService } from 'khoi-kien-thuc/khoi-kien-thuc.service';
import { LoaiDanhGiaService } from 'loai-danh-gia/loai-danh-gia.service';
import { LoaiKeHoachGiangDayService } from 'loai-ke-hoach-giang-day/loai-ke-hoach-giang-day.service';
import { LoaiKhoiKienThucService } from 'loai-khoi-kien-thuc/loai-khoi-kien-thuc.service';
import { MonHocTienQuyetService } from 'mon-hoc-tien-quyet/mon-hoc-tien-quyet.service';
import { MonHocService } from 'mon-hoc/mon-hoc.service';
import { MucTieuMonHocService } from 'muc-tieu-mon-hoc/muc-tieu-mon-hoc.service';
import { NamHocService } from 'nam-hoc/nam-hoc.service';
import { RolesService } from 'roles/roles.service';
import { SyllabusService } from 'syllabus/syllabus.service';
import { UsersService } from 'users/users.service';

@Injectable()
export class CronService {
  constructor(
    private chiTietGomNhomService: ChiTietGomNhomService,
    private chiTietKeHoachService: ChiTietKeHoachService,
    private chiTietNganhDaoTaoService: ChiTietNganhDaoTaoService,
    private chuanDauRaService: ChuanDauRaService,
    private chuanDauRaMonHocService: ChuanDauRaMonHocService,
    private chuanDauRaNganhDaoTaoService: ChuanDauRaNganhDaoTaoService,
    private chuDeService: ChuDeService,
    private chuongTrinhDaoTaoService: ChuongTrinhDaoTaoService,
    private gomNhomService: GomNhomService,
    private heDaotaoService: HeDaotaoService,
    private hoatDongDanhGiaService: HoatDongDanhGiaService,
    private hoatDongDayHocService: HoatDongDayHocService,
    private keHoachGiangDayService: KeHoachGiangDayService,
    private khoiKienThucService: KhoiKienThucService,
    private loaiDanhGiaService: LoaiDanhGiaService,
    private loaiKeHoachGiangDayService: LoaiKeHoachGiangDayService,
    private monHocService: MonHocService,
    private monHocTienQuyetService: MonHocTienQuyetService,
    private mucTieuMonHocService: MucTieuMonHocService,
    private namHocServicen: NamHocService,
    private rolesService: RolesService,
    private syllabusService: SyllabusService,
    private usersService: UsersService,
    private loaiKhoiKienThucService: LoaiKhoiKienThucService
  ) {}
  private readonly logger = new Logger(CronService.name);

  @Cron('* * * * 1 *')
  async handleCron() {
    this.logger.debug('Cron job start');
    await this.chuongTrinhDaoTaoService.deleteRowIsDeleted();
    await this.chiTietGomNhomService.deleteRowIsDeleted();
    await this.chiTietKeHoachService.deleteRowIsDeleted();
    await this.chiTietNganhDaoTaoService.deleteRowIsDeleted();
    await this.chuanDauRaService.deleteRowIsDeleted();
    await this.chuanDauRaMonHocService.deleteRowIsDeleted();
    await this.chuanDauRaNganhDaoTaoService.deleteRowIsDeleted();
    await this.chuDeService.deleteRowIsDeleted();
    await this.gomNhomService.deleteRowIsDeleted();
    await this.heDaotaoService.deleteRowIsDeleted();
    await this.hoatDongDanhGiaService.deleteRowIsDeleted();
    await this.hoatDongDayHocService.deleteRowIsDeleted();
    await this.keHoachGiangDayService.deleteRowIsDeleted();
    await this.khoiKienThucService.deleteRowIsDeleted();
    await this.loaiDanhGiaService.deleteRowIsDeleted();
    await this.loaiKeHoachGiangDayService.deleteRowIsDeleted();
    await this.monHocService.deleteRowIsDeleted();
    await this.monHocTienQuyetService.deleteRowIsDeleted();
    await this.mucTieuMonHocService.deleteRowIsDeleted();
    await this.namHocServicen.deleteRowIsDeleted();
    await this.rolesService.deleteRowIsDeleted();
    await this.syllabusService.deleteRowIsDeleted();
    await this.usersService.deleteRowIsDeleted();
    await this.loaiKhoiKienThucService.deleteRowIsDeleted();
    this.logger.debug('Delete successfully');
  }
}
