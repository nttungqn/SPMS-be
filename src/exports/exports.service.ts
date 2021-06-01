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

@Injectable()
export class ExportsService {
  constructor(
    private chiTietNganhDaoTaoService: ChiTietNganhDaoTaoService,
    private khoiKienThucService: KhoiKienThucService,
    private chuanDauRaNganhGomNhomService: ChuanDauRaNganhDaoTaoService,
    private loaiKhoiKienThucService: LoaiKhoiKienThucService,
    private gomNhomService: GomNhomService,
    private keHoachGiangDayService: KeHoachGiangDayService,
    private chiTietKeHoachGiangDayService: ChiTietKeHoachService,
    private cloneService: CloneService,
    private connection: Connection
  ) {
    connection = getConnection();
  }
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
      const khoiKienThucData = await this.khoiKienThucService.findAll({ chiTietNganh: result?.id });
      const khoiKienThuc = khoiKienThucData?.contents || [];
      let chuanDauRaNganhDaoTao = [];
      try {
        const chuanDauRaNganhDaoTaoData = await this.chuanDauRaNganhGomNhomService.findAll({
          nganhDaoTao: result?.id,
          limit: 10000
        });
        chuanDauRaNganhDaoTao = chuanDauRaNganhDaoTaoData?.contents || [];
      } catch (error) {
        chuanDauRaNganhDaoTao = [];
      }
      const results = groupBy(chuanDauRaNganhDaoTao, 'parent.ma');
      const loaiKhoiKienThucArray = khoiKienThuc.map(async (item) => {
        const results = await this.loaiKhoiKienThucService.findAllWithHaveSelectField({
          idKhoiKienThuc: item?.id,
          createdAt: 'ASC'
        });
        return { ...item, loaiKhoiKienThuc: results || [] };
      });
      const dataResults = await Promise.all(loaiKhoiKienThucArray);
      for (let i = 0; i < dataResults?.length; i++) {
        const gomNhomPromise = dataResults[i]?.loaiKhoiKienThuc?.map(async (item) => {
          const results = await this.gomNhomService.findAllWithSelectField({
            idLKKT: item?.id,
            select: 'chiTietGomNhom,chiTietGomNhom.idMH'
          });
          return { ...item, gomNhom: results || [] };
        });
        const gomNhom = await Promise.all(gomNhomPromise);
        dataResults[i] = { ...dataResults[i], loaiKhoiKienThuc: gomNhom };
      }
      let keHoachGiangDay = [];
      try {
        const keHoachGiangDayData = await this.keHoachGiangDayService.findAll({ nganhDaoTao: result?.id });
        keHoachGiangDay = keHoachGiangDayData?.contents || [];
      } catch (error) {
        keHoachGiangDay = [];
      }
      const chiTietKHGDArr = keHoachGiangDay?.map(async (item) => {
        const results = await this.chiTietKeHoachGiangDayService.findAllWithSelectField({
          idKHGD: item?.id,
          select: 'idCTGN,idCTGN.idGN,idCTGN.idMH'
        });
        return { ...item, chiTietKHGD: results || [] };
      });
      const chiTietKeHoach = await Promise.all(chiTietKHGDArr);
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
        chuanDauRaNganhDaoTao: results,
        cauTrucChuongTrinh: dataResults,
        keHoachGiangDay: chiTietKeHoach
      };
      const fileName = `${maNganhDaoTao}_${khoa}.pdf`;
      return { data, fileName };
    } catch (error) {
      console.log('error', error);
      throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
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

      // const khoiKienThucData = await this.khoiKienThucService.findAll({ chiTietNganh: result?.id });
      // const khoiKienThuc = khoiKienThucData?.contents || [];
      // let chuanDauRaNganhDaoTao = [];
      // try {
      //   const chuanDauRaNganhDaoTaoData = await this.chuanDauRaNganhGomNhomService.findAll({
      //     nganhDaoTao: result?.id,
      //     limit: 10000
      //   });
      //   chuanDauRaNganhDaoTao = chuanDauRaNganhDaoTaoData?.contents || [];
      // } catch (error) {
      //   chuanDauRaNganhDaoTao = [];
      // }
      // const results = groupBy(chuanDauRaNganhDaoTao, 'parent.ma');
      // const loaiKhoiKienThucArray = khoiKienThuc.map(async (item) => {
      //   const results = await this.loaiKhoiKienThucService.findAllWithHaveSelectField({
      //     idKhoiKienThuc: item?.id,
      //     createdAt: 'ASC'
      //   });
      //   return { ...item, loaiKhoiKienThuc: results || [] };
      // });
      // const dataResults = await Promise.all(loaiKhoiKienThucArray);
      // for (let i = 0; i < dataResults?.length; i++) {
      //   const gomNhomPromise = dataResults[i]?.loaiKhoiKienThuc?.map(async (item) => {
      //     const results = await this.gomNhomService.findAllWithSelectField({
      //       idLKKT: item?.id,
      //       select: 'chiTietGomNhom,chiTietGomNhom.idMH'
      //     });
      //     return { ...item, gomNhom: results || [] };
      //   });
      //   const gomNhom = await Promise.all(gomNhomPromise);
      //   dataResults[i] = { ...dataResults[i], loaiKhoiKienThuc: gomNhom };
      // }
      // let keHoachGiangDay = [];
      // try {
      //   const keHoachGiangDayData = await this.keHoachGiangDayService.findAll({ nganhDaoTao: result?.id });
      //   keHoachGiangDay = keHoachGiangDayData?.contents || [];
      // } catch (error) {
      //   keHoachGiangDay = [];
      // }
      // const chiTietKHGDArr = keHoachGiangDay?.map(async (item) => {
      //   const results = await this.chiTietKeHoachGiangDayService.findAllWithSelectField({
      //     idKHGD: item?.id,
      //     select: 'idCTGN,idCTGN.idGN,idCTGN.idMH'
      //   });
      //   return { ...item, chiTietKHGD: results || [] };
      // });
      // const chiTietKeHoach = await Promise.all(chiTietKHGDArr);
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
}
