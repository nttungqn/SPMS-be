import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, NGANHDAOTAO_MESSAGE } from 'constant/constant';
import { Repository, Like } from 'typeorm';
import { NganhDaoTaoEntity } from './entity/nganhDaoTao.entity';
import { INganhDaoTao } from './interfaces/nganhDaoTao.interface';

@Injectable()
export class CtdtService {
  constructor(
    @InjectRepository(NganhDaoTaoEntity) private readonly nganhDaoTaoRepository: Repository<NganhDaoTaoEntity>
  ) {}

  async findAll(filter: any): Promise<any> {
    const { limit = LIMIT, page = 0, search = '', ...rest } = filter;
    const skip = Number(page) * Number(limit);
    const querySearch = search ? { ten: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...rest
    };
    const results = await this.nganhDaoTaoRepository.find({
      relations: ['chuongTrinhDaoTao', 'createdBy', 'updatedBy'],
      skip,
      take: limit,
      where: query
    });
    if (!results.length) {
      throw new HttpException(NGANHDAOTAO_MESSAGE.NGANHDAOTAO_EMPTY, HttpStatus.NOT_FOUND);
    }
    const total = await this.nganhDaoTaoRepository.count({ ...query });
    return { contents: results, total, page: Number(page) };
  }

  async findById(ID: number): Promise<any> {
    const result = await this.nganhDaoTaoRepository.findOne({
      where: { ID, isDeleted: false },
      relations: ['chuongTrinhDaoTao', 'createdBy', 'updatedBy']
    });
    if (!result) {
      throw new HttpException(NGANHDAOTAO_MESSAGE.NGANHDAOTAO_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async create(newData: INganhDaoTao): Promise<any> {
    const checkExistName = await this.nganhDaoTaoRepository.findOne({ ten: newData?.ten, isDeleted: false });
    if (checkExistName) {
      throw new HttpException(NGANHDAOTAO_MESSAGE.NGANHDAOTAO_NAME_EXIST, HttpStatus.CONFLICT);
    }
    try {
      const newNganhDaoTao = await this.nganhDaoTaoRepository.create(newData);
      const saved = await this.nganhDaoTaoRepository.save(newNganhDaoTao);
      return saved;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(ID: number, updatedData: INganhDaoTao): Promise<any> {
    const nganhDaoTao = await this.nganhDaoTaoRepository.findOne({ ID, isDeleted: false });
    if (!nganhDaoTao) {
      throw new HttpException(NGANHDAOTAO_MESSAGE.NGANHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const updated = await this.nganhDaoTaoRepository.save({ ...nganhDaoTao, ...updatedData, updatedAt: new Date() });
      return updated;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(ID: number, updatedBy?: number): Promise<any> {
    const nganhDaoTao = await this.nganhDaoTaoRepository.findOne({ ID, isDeleted: false });
    if (!nganhDaoTao) {
      throw new HttpException(NGANHDAOTAO_MESSAGE.NGANHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const deleted = await this.nganhDaoTaoRepository.save({
        ...nganhDaoTao,
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
