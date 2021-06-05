import { ChiTietKeHoachService } from './../chi-tiet-ke-hoach/chi-tiet-ke-hoach.service';
import { KeHoachGiangDayService } from './../ke-hoach-giang-day/ke-hoach-giang-day.service';
import { GomNhomService } from './../gom-nhom/gom-nhom.service';
import { LoaiKhoiKienThucService } from './../loai-khoi-kien-thuc/loai-khoi-kien-thuc.service';
import { ChuanDauRaNganhDaoTaoService } from './../chuan-dau-ra-nganh-dao-tao/chuan-dau-ra-nganh-dao-tao.service';
import { KhoiKienThucService } from './../khoi-kien-thuc/khoi-kien-thuc.service';
import { CTNGANHDAOTAO_MESSAGE } from 'constant/constant';
import { ChiTietNganhDaoTaoService } from './../chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as lodash from 'lodash';
import { groupBy } from 'utils/utils';
import { CloneService } from 'clone/clone.service';
import { Connection, getConnection } from 'typeorm';
import { ChiTietNganhDaoTaoEntity } from 'chi-tiet-nganh-dao-tao/entity/chiTietNganhDaoTao.entity';
import { SyllabusService } from 'syllabus/syllabus.service';
import { ExportsDto } from './dto/exports.dto';
import { MucTieuMonHocService } from 'muc-tieu-mon-hoc/muc-tieu-mon-hoc.service';
import { ChuanDauRaMonHocService } from 'chuan-dau-ra-mon-hoc/chuan-dau-ra-mon-hoc.service';
import { ChuDeService } from 'chu-de/chu-de.service';
import { LoaiKeHoachGiangDayService } from 'loai-ke-hoach-giang-day/loai-ke-hoach-giang-day.service';
import { LoaiDanhGiaService } from 'loai-danh-gia/loai-danh-gia.service';

@Injectable()
export class ExportSyllabusService {
  constructor(
    private chiTietNganhDaoTaoService: ChiTietNganhDaoTaoService,
    private mucTieuMonHocService: MucTieuMonHocService,
    private connection: Connection,
    private syllabusService: SyllabusService,
    private chuanDauRaMonHocService: ChuanDauRaMonHocService,
    private chuDeService: ChuDeService,
    private loaiKeHoachGiangDayService: LoaiKeHoachGiangDayService,
    private loaiDanhGiaService: LoaiDanhGiaService
  ) {
    connection = getConnection();
  }
  async exportsFilePdf(filter: ExportsDto): Promise<any> {
    try {
      const syllabus = await this.syllabusService.findOne(filter.syllabusId);

      // 1.
      const ma = lodash.get(syllabus, 'monHoc.ma', '');
      const tenTiengViet = lodash.get(syllabus, 'monHoc.tenTiengViet', '');
      const tenTiengAnh = lodash.get(syllabus, 'monHoc.tenTiengAnh', '');
      const soTinChi = lodash.get(syllabus, 'monHoc.soTinChi', '');
      const soTietThucHanh = lodash.get(syllabus, 'monHoc.soTietThucHanh', '');
      const soTietTuHoc = lodash.get(syllabus, 'monHoc.soTietTuHoc', '');
      const soTietLyThuyet = lodash.get(syllabus, 'monHoc.soTietLyThuyet', '');
      let monHocTienQuyet = lodash.get(syllabus, 'monHocTienQuyet', []);
      if (monHocTienQuyet.length > 0) {
        monHocTienQuyet = monHocTienQuyet.forEach((e) => e.monHocTruoc.tenTiengViet).join(', ');
      } else {
        monHocTienQuyet = 'Không';
      }

      // 2.
      const moTa = lodash.get(syllabus, 'moTa', 'Không');

      // 3.
      let mucTieuMonHoc = await this.mucTieuMonHocService.findAll({ idSyllabus: filter.syllabusId, sortBy: 'ma' });
      mucTieuMonHoc = lodash.get(mucTieuMonHoc, 'contents', []);

      // 4.
      let chuanDauRaMonHoc = await this.chuanDauRaMonHocService.findAll({ idSyllabus: filter.syllabusId });
      chuanDauRaMonHoc = lodash.get(chuanDauRaMonHoc, 'contents', []);

      // prepare for 5 & 6
      let loaiKeHoachGiangDay = await this.loaiKeHoachGiangDayService.findAll({});
      loaiKeHoachGiangDay = lodash.get(loaiKeHoachGiangDay, 'contents', []);
      let lyThuyetId, thucHanhId;
      loaiKeHoachGiangDay.forEach((e) => {
        if (e['ma'] == 'LT' || e['ten'] == 'Lý Thuyết') lyThuyetId = e['id'];
        if (e['ma'] == 'TH' || e['ten'] == 'Thực Hành') thucHanhId = e['id'];
      });

      // 5.
      let keHoachGiangDayLyThuyet = await this.chuDeService.findAll({
        idSyllabus: filter.syllabusId,
        idLKHGD: lyThuyetId
      });
      keHoachGiangDayLyThuyet = lodash.get(keHoachGiangDayLyThuyet, 'contents', []);

      // 6.
      let keHoachGiangDayThucHanh = await this.chuDeService.findAll({
        idSyllabus: filter.syllabusId,
        idLKHGD: thucHanhId,
        sortBy: 'tuan'
      });
      keHoachGiangDayThucHanh = lodash.get(keHoachGiangDayThucHanh, 'contents', []);

      // 7.
      let loaiDanhGia = await this.loaiDanhGiaService.findAll({ idSyllabus: filter.syllabusId });
      loaiDanhGia = lodash.get(loaiDanhGia, 'contents', []);

      // 8.
      const taiNguyen = lodash.get(syllabus, 'taiNguyen', '');

      // 9.
      const quiDinh = lodash.get(syllabus, 'quiDinh', '');

      const data = {
        ma,
        tenTiengViet,
        tenTiengAnh,
        soTinChi,
        soTietThucHanh,
        soTietTuHoc,
        soTietLyThuyet,
        monHocTienQuyet,
        moTa,
        mucTieuMonHoc,
        chuanDauRaMonHoc,
        keHoachGiangDayLyThuyet,
        keHoachGiangDayThucHanh,
        loaiDanhGia,
        taiNguyen,
        quiDinh
      };
      const fileName = `syllabus-${ma}-${tenTiengViet}.pdf`;
      return { data, fileName };
    } catch (error) {
      console.log(error);
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async exportsFilePdfV2(filter): Promise<any> {
    try {
      const { contents = [] } = await this.chiTietNganhDaoTaoService.findAll({
        nganhDaoTao: filter?.nganhDaoTao,
        khoa: filter?.khoa
      });
      if (!contents?.length) {
        throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_EMPTY, HttpStatus.NOT_FOUND);
      }
      const result = contents[0] || null;
      const khoa = lodash.get(result, 'khoa', '');
      const coHoiNgheNghiep = lodash.get(result, 'coHoiNgheNghiep', '');
      const mucTieuChung = lodash.get(result, 'mucTieuChung', '');
      const tenNganhDaoTao = lodash.get(result, 'nganhDaoTao.ten', '');
      const maNganhDaoTao = lodash.get(result, 'nganhDaoTao.maNganhDaoTao', '');
      const loaiHinh = lodash.get(result, 'nganhDaoTao.chuongTrinhDaoTao.loaiHinh', '');
      const trinhDo = lodash.get(result, 'nganhDaoTao.chuongTrinhDaoTao.trinhDo', '');
      const tongTinChi = lodash.get(result, 'nganhDaoTao.chuongTrinhDaoTao.tongTinChi', '');
      const doiTuong = lodash.get(result, 'nganhDaoTao.chuongTrinhDaoTao.doiTuong', '');
      const quiTrinhDaoTao = lodash.get(result, 'nganhDaoTao.chuongTrinhDaoTao.quiTrinhDaoTao', '');
      const dieuKienTotNghiep = lodash.get(result, 'nganhDaoTao.chuongTrinhDaoTao.dieuKienTotNghiep', '');

      const ctndt = await this.connection
        .getRepository(ChiTietNganhDaoTaoEntity)
        .createQueryBuilder('ctndt')
        .leftJoinAndSelect('ctndt.keHoachGiangDayList', 'khgd')
        .leftJoinAndSelect('ctndt.chuanDaura', 'chuanDaura')
        .leftJoinAndSelect('ctndt.khoiKienThucList', 'khoiKienThucList')
        .where({ id: result?.id })
        .getOne();

      const data = {
        khoa,
        coHoiNgheNghiep,
        mucTieuChung,
        tenNganhDaoTao,
        maNganhDaoTao,
        trinhDo,
        loaiHinh,
        tongTinChi,
        doiTuong,
        quiTrinhDaoTao,
        dieuKienTotNghiep,
        khoiKienThuc: ctndt?.khoiKienThucList,
        chuanDauRaNganhDaoTao: ctndt.chuanDaura,
        cauTrucChuongTrinh: ctndt?.khoiKienThucList,
        keHoachGiangDay: ctndt?.keHoachGiangDayList
      };
      const fileName = `${maNganhDaoTao}_${khoa}.pdf`;
      return { data, fileName };
    } catch (error) {
      console.log('error', error);
      throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getInfoCTNDT(id): Promise<any> {
    try {
      const ctndt = await this.chiTietNganhDaoTaoService.findById(id);
      const khoa = lodash.get(ctndt, 'khoa', '');
      const coHoiNgheNghiep = lodash.get(ctndt, 'coHoiNgheNghiep', '');
      const mucTieuChung = lodash.get(ctndt, 'mucTieuChung', '');
      const tenNganhDaoTao = lodash.get(ctndt, 'nganhDaoTao.ten', '');
      const maNganhDaoTao = lodash.get(ctndt, 'nganhDaoTao.maNganhDaoTao', '');
      const loaiHinh = lodash.get(ctndt, 'nganhDaoTao.chuongTrinhDaoTao.loaiHinh', '');
      const trinhDo = lodash.get(ctndt, 'nganhDaoTao.chuongTrinhDaoTao.trinhDo', '');
      const tongTinChi = lodash.get(ctndt, 'nganhDaoTao.chuongTrinhDaoTao.tongTinChi', '');
      const doiTuong = lodash.get(ctndt, 'nganhDaoTao.chuongTrinhDaoTao.doiTuong', '');
      const quiTrinhDaoTao = lodash.get(ctndt, 'nganhDaoTao.chuongTrinhDaoTao.quiTrinhDaoTao', '');
      const dieuKienTotNghiep = lodash.get(ctndt, 'nganhDaoTao.chuongTrinhDaoTao.dieuKienTotNghiep', '');

      const data = {
        khoa,
        coHoiNgheNghiep,
        mucTieuChung,
        tenNganhDaoTao,
        maNganhDaoTao,
        trinhDo,
        loaiHinh,
        tongTinChi,
        doiTuong,
        quiTrinhDaoTao,
        dieuKienTotNghiep
      };
      return data;
    } catch (error) {
      console.log('error', error);
      throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
