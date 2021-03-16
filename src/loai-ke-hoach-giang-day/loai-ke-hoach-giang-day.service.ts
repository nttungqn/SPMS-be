import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, LOAIKEHOACHGIANGDAY_MESSAGE } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { LoaiKeHoachGiangDayEntity } from './entity/loaiKeHoachGiangDay.entity';

@Injectable()
export class LoaiKeHoachGiangDayService {
  constructor(
    @InjectRepository(LoaiKeHoachGiangDayEntity)
    private loaiKeHoachGiangDayEntity: Repository<LoaiKeHoachGiangDayEntity>
  ) {}

  async findAll(filter): Promise<LoaiKeHoachGiangDayEntity[] | any> {
    const { limit = LIMIT, page = 0, search = '', ...otherParam } = filter;
    const skip = Number(page) * Number(limit);
    const querySearch = search ? { ten: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...otherParam
    };

    const results = await this.loaiKeHoachGiangDayEntity.find({
      where: query,
      skip,
      take: Number(limit),
      relations: ['createdBy', 'updatedBy']
    });
    const total = await this.loaiKeHoachGiangDayEntity.count({ ...query });
    return { contents: results, total, page: Number(page) };
  }

  async findById(ID: number): Promise<LoaiKeHoachGiangDayEntity | any> {
    const result = await this.loaiKeHoachGiangDayEntity.findOne({
      where: { ID, isDeleted: false },
      relations: ['createdBy', 'updatedBy']
    });
    if (!result) {
      throw new NotFoundException(LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_ID_NOT_FOUND);
    }
    return result;
  }

  async create(newData: LoaiKeHoachGiangDayEntity): Promise<any> {
    const checkExistName = await this.loaiKeHoachGiangDayEntity.findOne({
      where: { ma: newData?.ma, isDeleted: false },
      relations: ['createdBy', 'updatedBy']
    });
    if (checkExistName) {
      throw new ConflictException(LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_EXIST);
    }
    try {
      const loaiKeHoachGiangDay = await this.loaiKeHoachGiangDayEntity.create(newData);
      const saved = await this.loaiKeHoachGiangDayEntity.save(loaiKeHoachGiangDay);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException(LOAIKEHOACHGIANGDAY_MESSAGE.CREATE_LOAIKEHOACHGIANGDAY_FAILED);
    }
  }

  async update(id: number, updatedData: LoaiKeHoachGiangDayEntity): Promise<any> {
    const loaiKeHoachGiangDay = await this.loaiKeHoachGiangDayEntity.findOne({ id, isDeleted: false });
    if (!loaiKeHoachGiangDay) {
      throw new NotFoundException(LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_ID_NOT_FOUND);
    }

    // check Ma is exist
    const monHocByMa = await this.loaiKeHoachGiangDayEntity.findOne({ ma: updatedData.ma, isDeleted: false });
    if (monHocByMa) {
      throw new ConflictException(LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_EXIST);
    }

    try {
      return await this.loaiKeHoachGiangDayEntity.save({
        ...loaiKeHoachGiangDay,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException(LOAIKEHOACHGIANGDAY_MESSAGE.UPDATE_LOAIKEHOACHGIANGDAY_FAILED);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const loaiKeHoachGiangDay = await this.loaiKeHoachGiangDayEntity.findOne({ id, isDeleted: false });
    if (!loaiKeHoachGiangDay) {
      throw new NotFoundException(LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_ID_NOT_FOUND);
    }
    try {
      return await this.loaiKeHoachGiangDayEntity.save({
        ...loaiKeHoachGiangDay,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException(LOAIKEHOACHGIANGDAY_MESSAGE.DELETE_LOAIKEHOACHGIANGDAY_FAILED);
    }
  }
}
