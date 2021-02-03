import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CHUONGTRINHDAOTAO_MESSAGE, LIMIT } from 'constant/constant';
import { Repository } from 'typeorm';
import { ChuongTrinhDaoTaoEntity } from './entity/chuongTrinhDaoTao.entity';
import { IChuongTrinhDaoTao } from './interfaces/chuongTrinhDaoTao.interface';

@Injectable()
export class ChuongTrinhDaoTaoService {
  constructor(
    @InjectRepository(ChuongTrinhDaoTaoEntity) private chuongTrinhDaoTaoRepository: Repository<ChuongTrinhDaoTaoEntity>
  ) {}
  async findAll(filter): Promise<ChuongTrinhDaoTaoEntity[] | any> {
    const { limit = LIMIT, page = 0 } = filter;
    const skip = Number(page) * Number(limit);
    const results = await this.chuongTrinhDaoTaoRepository.find({ skip, take: Number(limit) });
    if (!results.length) {
      return { status: HttpStatus.OK, data: { message: CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_EMPTY } };
    }
    const total = await this.chuongTrinhDaoTaoRepository.count();
    return { status: HttpStatus.OK, data: { contents: results, total, page: Number(page) } };
  }
  async findById(ID: number): Promise<ChuongTrinhDaoTaoEntity | any> {
    const result = await this.chuongTrinhDaoTaoRepository.findOne({ ID });
    if (!result) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: { message: CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_ID_NOT_FOUND }
      };
    }
    return { status: HttpStatus.OK, data: result };
  }
  async create(newData: IChuongTrinhDaoTao): Promise<any> {
    const checkExistName = await this.chuongTrinhDaoTaoRepository.findOne({ Ten: newData?.Ten });
    if (checkExistName) {
      return { status: HttpStatus.CONFLICT, data: { message: CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_NAME_EXIST } };
    }
    try {
      const newChuongTrinhDaoTao = await this.chuongTrinhDaoTaoRepository.create(newData);
      await this.chuongTrinhDaoTaoRepository.save(newChuongTrinhDaoTao);
      return {
        status: HttpStatus.CREATED,
        data: { message: CHUONGTRINHDAOTAO_MESSAGE.CREATE_CHUONGTRINHDAOTAO_SUCCESSFULLY }
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: CHUONGTRINHDAOTAO_MESSAGE.CREATE_CHUONGTRINHDAOTAO_FAILED }
      };
    }
  }
  async update(ID: number, updatedData: IChuongTrinhDaoTao): Promise<any> {
    const chuongtrinhdaotao = await this.chuongTrinhDaoTaoRepository.findOne({ ID });
    if (!chuongtrinhdaotao) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: { message: CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_ID_NOT_FOUND }
      };
    }
    try {
      await this.chuongTrinhDaoTaoRepository.save({ ...chuongtrinhdaotao, ...updatedData });
      return {
        status: HttpStatus.OK,
        data: { message: CHUONGTRINHDAOTAO_MESSAGE.UPDATE_CHUONGTRINHDAOTAO_SUCCESSFULLY }
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: CHUONGTRINHDAOTAO_MESSAGE.UPDATE_CHUONGTRINHDAOTAO_FAILED }
      };
    }
  }
  async delete(ID: number): Promise<any> {
    const chuongtrinhdaotao = await this.chuongTrinhDaoTaoRepository.findOne({ ID });
    if (!chuongtrinhdaotao) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: { message: CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_ID_NOT_FOUND }
      };
    }
    try {
      await this.chuongTrinhDaoTaoRepository.remove(chuongtrinhdaotao);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: CHUONGTRINHDAOTAO_MESSAGE.DELETE_CHUONGTRINHDAOTAO_SUCCESSFULLY }
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: CHUONGTRINHDAOTAO_MESSAGE.DELETE_CHUONGTRINHDAOTAO_FAILED }
      };
    }
  }
}
