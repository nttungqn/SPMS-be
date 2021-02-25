import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MONHOC_MESSAGE, LIMIT } from 'constant/constant';
import { Repository } from 'typeorm';
import { MonHocEntity } from './entity/monHoc.entity';
import { IMonHoc } from './interfaces/monHoc.interface';

@Injectable()
export class MonHocService {
  constructor(
    @InjectRepository(MonHocEntity) private monHocRepository: Repository<MonHocEntity>
  ) {}
  async findAll(filter): Promise<MonHocEntity[] | any> {
    const { limit = LIMIT, page = 0 } = filter;
    const skip = Number(page) * Number(limit);
    const results = await this.monHocRepository.find({ skip, take: Number(limit), 
      //   where: [
      //   { isDeleted: false },
      // ]
    });
    if (!results.length) {
      return { status: HttpStatus.OK, data: { message: MONHOC_MESSAGE.MONHOC_EMPTY } };
    }
    const total = await this.monHocRepository.count();
    return { status: HttpStatus.OK, data: { contents: results, total, page: Number(page) } };
  }
  async findById(ID: number): Promise<MonHocEntity | any> {
    const result = await this.monHocRepository.findOne({ ID });
    if (!result) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: { message: MONHOC_MESSAGE.MONHOC_ID_NOT_FOUND }
      };
    }
    return { status: HttpStatus.OK, data: result };
  }
  async create(newData: IMonHoc): Promise<any> {
    const checkExist = await this.monHocRepository.findOne({ Ma: newData?.Ma });
    if (checkExist) {
      return { status: HttpStatus.CONFLICT, data: { message: MONHOC_MESSAGE.MONHOC_NAME_EXIST } };
    }
    try {
      const newMonHoc = await this.monHocRepository.create(newData);
    //TODO: createdBy = current user

      await this.monHocRepository.save(newMonHoc);
      return {
        status: HttpStatus.CREATED,
        data: { message: MONHOC_MESSAGE.CREATE_MONHOC_SUCCESSFULLY }
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: MONHOC_MESSAGE.CREATE_MONHOC_FAILED }
      };
    }
  }
  async update(ID: number, updatedData: IMonHoc): Promise<any> {
    const monhoc = await this.monHocRepository.findOne({ ID });
    if (!monhoc) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: { message: MONHOC_MESSAGE.MONHOC_ID_NOT_FOUND }
      };
    }
    try {
      //TODO: updatedAt = Date.now(), updatedBy = current user
      await this.monHocRepository.save({ ...monhoc, ...updatedData });
      return {
        status: HttpStatus.OK,
        data: { message: MONHOC_MESSAGE.UPDATE_MONHOC_SUCCESSFULLY }
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: MONHOC_MESSAGE.UPDATE_MONHOC_FAILED }
      };
    }
  }
  async delete(ID: number): Promise<any> {
    const monhoc = await this.monHocRepository.findOne({ ID });
    if (!monhoc) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: { message: MONHOC_MESSAGE.MONHOC_ID_NOT_FOUND }
      };
    }
    try {
      await this.monHocRepository.remove(monhoc);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: MONHOC_MESSAGE.DELETE_MONHOC_SUCCESSFULLY }
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: MONHOC_MESSAGE.DELETE_MONHOC_FAILED }
      };
    }
  }
}
