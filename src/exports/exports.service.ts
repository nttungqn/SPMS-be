import { ChuanDauRaNganhDaoTaoService } from './../chuan-dau-ra-nganh-dao-tao/chuan-dau-ra-nganh-dao-tao.service';
import { KhoiKienThucService } from './../khoi-kien-thuc/khoi-kien-thuc.service';
import { CTNGANHDAOTAO_MESSAGE } from 'constant/constant';
import { ChiTietNganhDaoTaoService } from './../chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as lodash from 'lodash';
import { groupBy } from 'utils/utils';

@Injectable()
export class ExportsService {
  constructor(
    private chiTietNganhDaoTaoService: ChiTietNganhDaoTaoService,
    private khoiKienThucService: KhoiKienThucService,
    private chuanDauRaNganhGomNhomService: ChuanDauRaNganhDaoTaoService
  ) {}
  async exportsFilePdf(filter): Promise<any> {
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
      const khoiKienThucData = await this.khoiKienThucService.findAll({ idChiTietNganhDaoTao: result?.id });
      const khoiKienThuc = khoiKienThucData?.contents || [];
      const chuanDauRaNganhDaoTaoData = await this.chuanDauRaNganhGomNhomService.findAll({
        nganhDaoTao: result?.id,
        limit: 10000
      });
      const chuanDauRaNganhDaoTao = chuanDauRaNganhDaoTaoData?.contents || [];
      const results = groupBy(chuanDauRaNganhDaoTao, 'parent.ma');
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
        khoiKienThuc,
        chuanDauRaNganhDaoTao: results
      };
      const fileName = `${maNganhDaoTao}_${khoa}.pdf`;
      return { data, fileName };
    } catch (error) {
      console.log('error', error);
      throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
