import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as lodash from 'lodash';
import { Connection, getConnection } from 'typeorm';
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
      const fileName = `syllabus-${ma}.pdf`;
      return { data, fileName };
    } catch (error) {
      console.log(error);
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
