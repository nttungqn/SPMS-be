import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CHUONGTRINHDAOTAO_MESSAGE, LIMIT } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { ChuongTrinhDaoTaoEntity } from './entity/chuongTrinhDaoTao.entity';
import { IChuongTrinhDaoTao } from './interfaces/chuongTrinhDaoTao.interface';

@Injectable()
export class ChuongTrinhDaoTaoService {
  constructor(
    @InjectRepository(ChuongTrinhDaoTaoEntity) private chuongTrinhDaoTaoRepository: Repository<ChuongTrinhDaoTaoEntity>
  ) {}
  async findAll(filter): Promise<ChuongTrinhDaoTaoEntity[] | any> {
    const { limit = LIMIT, page = 0, search = '', ...rest } = filter;
    const skip = Number(page) * Number(limit);
    const querySearch = search ? { ten: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...rest
    };
    const results = await this.chuongTrinhDaoTaoRepository.find({ where: query, skip, take: Number(limit) });
    if (!results.length) {
      throw new HttpException(CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_EMPTY, HttpStatus.NOT_FOUND);
    }
    const total = await this.chuongTrinhDaoTaoRepository.count(query);
    return { contents: results, total, page: Number(page) };
  }
  async findById(ID: number): Promise<ChuongTrinhDaoTaoEntity | any> {
    const result = await this.chuongTrinhDaoTaoRepository.findOne({ ID, isDeleted: false });
    if (!result) {
      throw new HttpException(CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return result;
  }
  async create(newData: IChuongTrinhDaoTao): Promise<any> {
    const checkExistName = await this.chuongTrinhDaoTaoRepository.findOne({
      where: [
        { ten: newData?.ten, isDeleted: false },
        { maCTDT: newData?.maCTDT, isDeleted: false }
      ]
    });
    if (checkExistName) {
      throw new HttpException(CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_NAME_OR_CODE_EXIST, HttpStatus.CONFLICT);
    }
    try {
      const newChuongTrinhDaoTao = await this.chuongTrinhDaoTaoRepository.create(newData);
      const saved = await this.chuongTrinhDaoTaoRepository.save(newChuongTrinhDaoTao);
      return saved;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async update(ID: number, updatedData: IChuongTrinhDaoTao): Promise<any> {
    const chuongtrinhdaotao = await this.chuongTrinhDaoTaoRepository.findOne({ ID, isDeleted: false });
    if (!chuongtrinhdaotao) {
      throw new HttpException(CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const updated = await this.chuongTrinhDaoTaoRepository.save({
        ...chuongtrinhdaotao,
        ...updatedData,
        updatedAt: new Date()
      });
      return updated;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async delete(ID: number, updatedBy?: number): Promise<any> {
    const chuongtrinhdaotao = await this.chuongTrinhDaoTaoRepository.findOne({ ID, isDeleted: false });
    if (!chuongtrinhdaotao) {
      throw new HttpException(CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const deleted = await this.chuongTrinhDaoTaoRepository.save({
        ...chuongtrinhdaotao,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      return deleted;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
