import {
  HttpStatus,
  Injectable,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { MonHocEntity } from './entity/monHoc.entity';
import { IMonHoc } from './interfaces/monHoc.interface';

@Injectable()
export class MonHocService {
  constructor(@InjectRepository(MonHocEntity) private monHocRepository: Repository<MonHocEntity>) {}

  async findAll(filter): Promise<MonHocEntity[] | any> {
    const { limit = LIMIT, page = 0, search = '', ...otherParam } = filter;
    const skip = Number(page) * Number(limit);
    const querySearch = search ? { TenTiengViet: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...otherParam
    };

    try {
      const results = await this.monHocRepository.find({ where: query, skip, take: Number(limit) });
      const total = await this.monHocRepository.count({ ...query });
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findById(ID: number): Promise<MonHocEntity | any> {
    const result = await this.monHocRepository.findOne({ ID, isDeleted: false });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async create(newData: IMonHoc): Promise<any> {
    const checkExistName = await this.monHocRepository.findOne({ Ma: newData?.Ma, isDeleted: false });
    if (checkExistName) {
      throw new ConflictException();
    }
    try {
      const monhoc = await this.monHocRepository.create(newData);
      const saved = await this.monHocRepository.save(monhoc);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(ID: number, updatedData: IMonHoc): Promise<any> {
    const monhoc = await this.monHocRepository.findOne({ ID, isDeleted: false });
    if (!monhoc) {
      throw new NotFoundException();
    }

    // check Ma is exist
    const monHocByMa = await this.monHocRepository.findOne({ Ma: updatedData.Ma, isDeleted: false });
    if (monHocByMa) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: '"Ma mon hoc" is exit'
        },
        HttpStatus.CONFLICT
      );
    }

    try {
      return await this.monHocRepository.save({
        ...monhoc,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async delete(ID: number, updatedBy?: number): Promise<any> {
    const monhoc = await this.monHocRepository.findOne({ ID, isDeleted: false });
    if (!monhoc) {
      throw new NotFoundException();
    }
    try {
      return await this.monHocRepository.save({
        ...monhoc,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
