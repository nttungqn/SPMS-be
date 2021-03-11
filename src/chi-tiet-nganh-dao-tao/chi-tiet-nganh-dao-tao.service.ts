import { GomNhomEntity } from './../gom-nhom/entity/gom-nhom.entity';
import { ChiTietGomNhomEntity } from './../chi-tiet-gom-nhom/entity/chi-tiet-gom-nhom.entity';
import { LoaiKhoiKienThucEntity } from './../loai-khoi-kien-thuc/entity/type-of-knowledge-block.entity';
import { KhoiKienThucEntity } from 'khoi-kien-thuc/entity/khoi-kien-thuc.entity';
import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChuanDauRaNganhDaoTaoEntity } from 'chuan-dau-ra-nganh-dao-tao/entity/chuanDauRaNganhDaoTao.entity';
import { CTNGANHDAOTAO_MESSAGE, LIMIT } from 'constant/constant';
import { Repository } from 'typeorm';
import { ChiTietNganhDaoTaoEntity } from './entity/chiTietNganhDaoTao.entity';
import { IChiTietNganhDaoTao } from './interfaces/chiTietNganhDaoTao.interface';

@Injectable()
export class ChiTietNganhDaoTaoService {
  constructor(
    @InjectRepository(ChiTietNganhDaoTaoEntity)
    private readonly chiTietNganhDTRepository: Repository<ChiTietNganhDaoTaoEntity>,
    @InjectRepository(ChuanDauRaNganhDaoTaoEntity)
    private readonly chuanDauRaNDTRepository: Repository<ChuanDauRaNganhDaoTaoEntity>,
    @InjectRepository(KhoiKienThucEntity)
    private readonly khoiKienThucRepository: Repository<KhoiKienThucEntity>,
    @InjectRepository(LoaiKhoiKienThucEntity)
    private readonly loaiKhoiKienThucRepository: Repository<LoaiKhoiKienThucEntity>,
    @InjectRepository(ChiTietGomNhomEntity)
    private readonly chiTietGomNhomRepository: Repository<ChiTietGomNhomEntity>,
    @InjectRepository(GomNhomEntity)
    private readonly gomNhomRepository: Repository<GomNhomEntity>
  ) {}

  async findAll(filter: any): Promise<any> {
    const { limit = LIMIT, page = 0, ...rest } = filter;
    const skip = Number(page) * Number(limit);
    const query = {
      isDeleted: false,
      ...rest
    };
    const results = await this.chiTietNganhDTRepository.find({
      relations: ['nganhDaoTao', 'createdBy', 'updatedBy', 'nganhDaoTao.chuongTrinhDaoTao'],
      skip,
      take: limit,
      where: query
    });
    if (!results.length) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_EMPTY, HttpStatus.NOT_FOUND);
    }
    const total = await this.chiTietNganhDTRepository.count({ ...query });
    return { contents: results, total, page: Number(page) };
  }

  async findById(id: number): Promise<any> {
    const result = await this.chiTietNganhDTRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['nganhDaoTao', 'createdBy', 'updatedBy', 'nganhDaoTao.chuongTrinhDaoTao']
    });
    if (!result) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async create(newData: IChiTietNganhDaoTao): Promise<any> {
    const checkExistData = await this.chiTietNganhDTRepository.findOne({
      khoa: newData?.khoa,
      nganhDaoTao: newData.nganhDaoTao,
      isDeleted: false
    });
    if (checkExistData) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_EXIST, HttpStatus.CONFLICT);
    }
    try {
      const newCTNganhDaoTao = await this.chiTietNganhDTRepository.create(newData);
      const saved = await this.chiTietNganhDTRepository.save(newCTNganhDaoTao);
      return saved;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updatedData: IChiTietNganhDaoTao): Promise<any> {
    const cTNganhDaoTao = await this.chiTietNganhDTRepository.findOne({ id, isDeleted: false });
    if (!cTNganhDaoTao) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const updated = await this.chiTietNganhDTRepository.save({
        ...cTNganhDaoTao,
        ...updatedData,
        updatedAt: new Date()
      });
      return updated;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const cTNganhDaoTao = await this.chiTietNganhDTRepository.findOne({ id, isDeleted: false });
    if (!cTNganhDaoTao) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const deleted = await this.chiTietNganhDTRepository.save({
        ...cTNganhDaoTao,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      return deleted;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getMucTieuDaoTao(id: number) {
    const cTNganhDaoTao = await this.chiTietNganhDTRepository.findOne({ id, isDeleted: false });
    if (!cTNganhDaoTao) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const chiTietNganhDT = await this.findById(id);
      const query = {
        nganhDaoTao: id,
        isDeleted: false
      };
      const results = await this.chuanDauRaNDTRepository.find({
        relations: ['parent', 'nganhDaoTao', 'chuanDauRa', 'createdBy', 'updatedBy'],
        where: query
      });
      if (!results.length) {
        throw new HttpException(CTNGANHDAOTAO_MESSAGE.MUCTIEUDAOTAO_EMPTY, HttpStatus.NOT_FOUND);
      }
      return { data: { mucTieuCuThe: results, ...chiTietNganhDT } };
    } catch (error) {
      throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getNoiDungDaoTao(id: number) {
    const cTNganhDaoTao = await this.chiTietNganhDTRepository.findOne({ id, isDeleted: false });
    if (!cTNganhDaoTao) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const query = {
        nganhDaoTao: id,
        isDeleted: false
      };
      const khoiKienThuc = await this.khoiKienThucRepository.find({
        where: { chiTietNganh: id, isDeleted: false },
        relations: ['chiTietNganh', 'createdBy', 'updatedBy']
      });
      if (!khoiKienThuc.length) {
        throw new HttpException('khoiKienThuc empty', HttpStatus.NOT_FOUND);
      }
      const loaiKhoiKienThuc = khoiKienThuc.map(async (item) => {
        const result = await this.loaiKhoiKienThucRepository.find({
          where: { isDeleted: false, khoiKienThuc: item?.id }
        });
        return { ...item, loaiKhoiKienThuc: result };
      });
      const newLoaiKhoiKienThuc = await Promise.all(loaiKhoiKienThuc);
      if (!newLoaiKhoiKienThuc.length) {
        throw new HttpException('loaiKhoiKienThuc empty', HttpStatus.NOT_FOUND);
      }
      const gomNhom = newLoaiKhoiKienThuc.map(async (item) => {
        const results = await this.gomNhomRepository.find({
          where: { isDeleted: false, idLKKT: item?.loaiKhoiKienThuc[0] }
        });
        return { ...item, loaiKhoiKienThuc: results };
      });
      // const results = await this.chuanDauRaNDTRepository.find({
      //   relations: ['parent', 'nganhDaoTao', 'chuanDauRa', 'createdBy', 'updatedBy'],
      //   where: query
      // });
      // if (!results.length) {
      //   throw new HttpException(CTNGANHDAOTAO_MESSAGE.MUCTIEUDAOTAO_EMPTY, HttpStatus.NOT_FOUND);
      // }
      return { data: newLoaiKhoiKienThuc };
    } catch (error) {
      throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getKeHoachGiangDay(id: number) {
    const cTNganhDaoTao = await this.chiTietNganhDTRepository.findOne({ id, isDeleted: false });
    if (!cTNganhDaoTao) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }
}
