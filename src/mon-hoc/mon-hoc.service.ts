import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, MONHOC_MESSAGE } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { MonHocEntity } from './entity/mon-hoc.entity';

@Injectable()
export class MonHocService {
  constructor(@InjectRepository(MonHocEntity) private monHocRepository: Repository<MonHocEntity>) {}

  async findAll(filter): Promise<MonHocEntity[] | any> {
    const { limit = LIMIT, page = 0, search = '', ...otherParam } = filter;
    const skip = Number(page) * Number(limit);
    const querySearch = search ? { tenTiengViet: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...otherParam
    };

    const results = await this.monHocRepository.find({
      where: query,
      skip,
      take: Number(limit),
      relations: ['createdBy', 'updatedBy']
    });
    const total = await this.monHocRepository.count({ ...query });
    return { contents: results, total, page: Number(page) };
  }

  async findById(id: number): Promise<MonHocEntity | any> {
    const result = await this.monHocRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['createdBy', 'updatedBy']
    });
    if (!result) {
      throw new NotFoundException(MONHOC_MESSAGE.MONHOC_ID_NOT_FOUND);
    }
    return result;
  }

  async create(newData: MonHocEntity): Promise<any> {
    const checkExistName = await this.monHocRepository.findOne({ ma: newData?.ma, isDeleted: false });
    if (checkExistName) {
      throw new ConflictException(MONHOC_MESSAGE.MONHOC_EXIST);
    }
    try {
      const monhoc = await this.monHocRepository.create(newData);
      const saved = await this.monHocRepository.save(monhoc);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException(MONHOC_MESSAGE.CREATE_MONHOC_FAILED);
    }
  }

  async update(id: number, updatedData: MonHocEntity): Promise<any> {
    const monhoc = await this.monHocRepository.findOne({ id, isDeleted: false });
    if (!monhoc) {
      throw new NotFoundException(MONHOC_MESSAGE.MONHOC_ID_NOT_FOUND);
    }

    // check Ma is exist
    const monHocByMa = await this.monHocRepository.findOne({ ma: updatedData.ma, isDeleted: false });
    if (monHocByMa) {
      throw new ConflictException(MONHOC_MESSAGE.MONHOC_EXIST);
    }

    try {
      return await this.monHocRepository.save({
        ...monhoc,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException(MONHOC_MESSAGE.UPDATE_MONHOC_FAILED);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const monhoc = await this.monHocRepository.findOne({ id, isDeleted: false });
    if (!monhoc) {
      throw new NotFoundException(MONHOC_MESSAGE.MONHOC_ID_NOT_FOUND);
    }
    try {
      return await this.monHocRepository.save({
        ...monhoc,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException(MONHOC_MESSAGE.DELETE_MONHOC_FAILED);
    }
  }
  async getMonHocThayThe(idMonThayThe: number): Promise<MonHocEntity[]> {
    const results = this.monHocRepository.find({ where: { isDeleted: false, monThayThe: idMonThayThe } });
    return results;
  }
}
