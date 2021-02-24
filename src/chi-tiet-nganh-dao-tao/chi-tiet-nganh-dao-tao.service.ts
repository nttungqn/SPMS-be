import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CTNGANHDAOTAO_MESSAGE, LIMIT } from 'constant/constant';
import { Repository } from 'typeorm';
import { ChiTietNganhDaoTaoEntity } from './entity/chiTietNganhDaoTao.entity';
import { IChiTietNganhDaoTao } from './interfaces/chiTietNganhDaoTao.interface';

@Injectable()
export class ChiTietNganhDaoTaoService {
  @InjectRepository(ChiTietNganhDaoTaoEntity)
  private readonly chiTietNganhDTRepository: Repository<ChiTietNganhDaoTaoEntity>;

  async findAll(filter: any): Promise<any> {
    const { limit = LIMIT, page = 0, ...rest } = filter;
    const skip = Number(page) * Number(limit);
    const query = {
      isDeleted: false,
      ...rest
    };
    const results = await this.chiTietNganhDTRepository.find({
      relations: ['NganhDaoTao', 'createdBy', 'updatedBy'],
      skip,
      take: limit,
      where: query
    });
    if (!results.length) {
      return { status: HttpStatus.OK, data: { message: CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_EMPTY } };
    }
    const total = await this.chiTietNganhDTRepository.count({ ...query });
    return { status: HttpStatus.OK, data: { contents: results, total, page: Number(page) } };
  }

  async findById(ID: number): Promise<any> {
    const result = await this.chiTietNganhDTRepository.findOne({
      where: { ID, isDeleted: false },
      relations: ['NganhDaoTao', 'createdBy', 'updatedBy']
    });
    if (!result) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: { message: CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND }
      };
    }
    return { status: HttpStatus.OK, data: result };
  }

  async create(newData: IChiTietNganhDaoTao): Promise<any> {
    const checkExistData = await this.chiTietNganhDTRepository.findOne({
      Khoa: newData?.Khoa,
      NganhDaoTao: newData.NganhDaoTao,
      isDeleted: false
    });
    if (checkExistData) {
      return { status: HttpStatus.CONFLICT, data: { message: CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_EXIST } };
    }
    try {
      const newCTNganhDaoTao = await this.chiTietNganhDTRepository.create(newData);
      await this.chiTietNganhDTRepository.save(newCTNganhDaoTao);
      return {
        status: HttpStatus.CREATED,
        data: { message: CTNGANHDAOTAO_MESSAGE.CREATE_CTNGANHDAOTAO_SUCCESSFULLY }
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: CTNGANHDAOTAO_MESSAGE.CREATE_CTNGANHDAOTAO_FAILED }
      };
    }
  }

  async update(ID: number, updatedData: IChiTietNganhDaoTao): Promise<any> {
    const cTNganhDaoTao = await this.chiTietNganhDTRepository.findOne({ ID, isDeleted: false });
    if (!cTNganhDaoTao) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: { message: CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND }
      };
    }
    try {
      await this.chiTietNganhDTRepository.save({ ...cTNganhDaoTao, ...updatedData, updatedAt: new Date() });
      return {
        status: HttpStatus.OK,
        data: { message: CTNGANHDAOTAO_MESSAGE.UPDATE_CTNGANHDAOTAO_SUCCESSFULLY }
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: CTNGANHDAOTAO_MESSAGE.UPDATE_CTNGANHDAOTAO_FAILED }
      };
    }
  }

  async delete(ID: number, updatedBy?: number): Promise<any> {
    const cTNganhDaoTao = await this.chiTietNganhDTRepository.findOne({ ID, isDeleted: false });
    if (!cTNganhDaoTao) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: { message: CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND }
      };
    }
    try {
      await this.chiTietNganhDTRepository.save({ ...cTNganhDaoTao, isDeleted: true, updatedAt: new Date(), updatedBy });
      return {
        status: HttpStatus.OK,
        data: { message: CTNGANHDAOTAO_MESSAGE.DELETE_CTNGANHDAOTAO_SUCCESSFULLY }
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: CTNGANHDAOTAO_MESSAGE.DELETE_CTNGANHDAOTAO_FAILED }
      };
    }
  }
}
