import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, NGANHDAOTAO_MESSAGE, TABLE_NAME } from 'constant/constant';
import { Repository, Like } from 'typeorm';
import { NganhDaoTaoEntity } from './entity/nganhDaoTao.entity';
import { INganhDaoTao } from './interfaces/nganhDaoTao.interface';

@Injectable()
export class CtdtService {
  constructor(
    @InjectRepository(NganhDaoTaoEntity) private readonly nganhDaoTaoRepository: Repository<NganhDaoTaoEntity>
  ) {}

  async findAll(filter: any): Promise<any> {
    const { limit = LIMIT, page = 0, search = '' } = filter;
    const skip = Number(page) * Number(limit);
    const querySearch = search ? { Ten: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch
    };
    const results = await this.nganhDaoTaoRepository.find({
      relations: ['ctdt', 'createdBy', 'updatedBy'],
      skip,
      take: limit,
      where: query
    });
    if (!results.length) {
      return { status: HttpStatus.OK, data: { message: NGANHDAOTAO_MESSAGE.NGANHDAOTAO_EMPTY } };
    }
    const total = await this.nganhDaoTaoRepository.count({ ...query });
    return { status: HttpStatus.OK, data: { contents: results, total, page: Number(page) } };
  }

  async findById(ID: number): Promise<any> {
    const result = await this.nganhDaoTaoRepository.findOne({
      where: { ID, isDeleted: false },
      relations: ['ctdt', 'createdBy', 'updatedBy']
    });
    if (!result) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: { message: NGANHDAOTAO_MESSAGE.NGANHDAOTAO_ID_NOT_FOUND }
      };
    }
    return { status: HttpStatus.OK, data: result };
  }

  async create(newData: INganhDaoTao): Promise<any> {
    const checkExistName = await this.nganhDaoTaoRepository.findOne({ Ten: newData?.Ten, isDeleted: false });
    if (checkExistName) {
      return { status: HttpStatus.CONFLICT, data: { message: NGANHDAOTAO_MESSAGE.NGANHDAOTAO_NAME_EXIST } };
    }
    try {
      const newNganhDaoTao = await this.nganhDaoTaoRepository.create(newData);
      await this.nganhDaoTaoRepository.save(newNganhDaoTao);
      return {
        status: HttpStatus.CREATED,
        data: { message: NGANHDAOTAO_MESSAGE.CREATE_NGANHDAOTAO_SUCCESSFULLY }
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: NGANHDAOTAO_MESSAGE.CREATE_NGANHDAOTAO_FAILED }
      };
    }
  }

  async update(ID: number, updatedData: INganhDaoTao): Promise<any> {
    const nganhDaoTao = await this.nganhDaoTaoRepository.findOne({ ID, isDeleted: false });
    if (!nganhDaoTao) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: { message: NGANHDAOTAO_MESSAGE.NGANHDAOTAO_ID_NOT_FOUND }
      };
    }
    try {
      await this.nganhDaoTaoRepository.save({ ...nganhDaoTao, ...updatedData, updatedAt: new Date() });
      return {
        status: HttpStatus.OK,
        data: { message: NGANHDAOTAO_MESSAGE.UPDATE_NGANHDAOTAO_SUCCESSFULLY }
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: NGANHDAOTAO_MESSAGE.UPDATE_NGANHDAOTAO_SUCCESSFULLY }
      };
    }
  }

  async delete(ID: number, updatedBy?: string): Promise<any> {
    const nganhDaoTao = await this.nganhDaoTaoRepository.findOne({ ID, isDeleted: false });
    if (!nganhDaoTao) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: { message: NGANHDAOTAO_MESSAGE.NGANHDAOTAO_ID_NOT_FOUND }
      };
    }
    try {
      await this.nganhDaoTaoRepository.save({ ...nganhDaoTao, isDeleted: true, updatedAt: new Date() });
      return {
        status: HttpStatus.OK,
        data: { message: NGANHDAOTAO_MESSAGE.DELETE_NGANHDAOTAO_SUCCESSFULLY }
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: NGANHDAOTAO_MESSAGE.DELETE_NGANHDAOTAO_FAILED }
      };
    }
  }
}
