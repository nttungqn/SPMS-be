import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { LoaiKeHoachGiangDayEntity } from './entity/loaiKeHoachGiangDay.entity';
import { ILoaiKeHoachGiangDay } from './interfaces/loaiKeHoachGiangDay.interface';

@Injectable()
export class LoaiKeHoachGiangDayService {
  constructor(
    @InjectRepository(LoaiKeHoachGiangDayEntity)
    private loaiKeHoachGiangDayEntity: Repository<LoaiKeHoachGiangDayEntity>
  ) {}

  async findAll(filter): Promise<LoaiKeHoachGiangDayEntity[] | any> {
    const { limit = LIMIT, page = 0, search = '', ...otherParam } = filter;
    const skip = Number(page) * Number(limit);
    const querySearch = search ? { Ten: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...otherParam
    };

    try {
      const results = await this.loaiKeHoachGiangDayEntity.find({
        where: query,
        skip,
        take: Number(limit),
        relations: ['createdBy', 'updatedBy']
      });
      const total = await this.loaiKeHoachGiangDayEntity.count({ ...query });
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findById(ID: number): Promise<LoaiKeHoachGiangDayEntity | any> {
    const result = await this.loaiKeHoachGiangDayEntity.findOne({
      where: { ID, isDeleted: false },
      relations: ['createdBy', 'updatedBy']
    });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async create(newData: ILoaiKeHoachGiangDay): Promise<any> {
    const checkExistName = await this.loaiKeHoachGiangDayEntity.findOne({
      where: { Ma: newData?.Ma, isDeleted: false },
      relations: ['createdBy', 'updatedBy']
    });
    if (checkExistName) {
      throw new ConflictException();
    }
    try {
      const loaiKeHoachGiangDay = await this.loaiKeHoachGiangDayEntity.create(newData);
      const saved = await this.loaiKeHoachGiangDayEntity.save(loaiKeHoachGiangDay);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(ID: number, updatedData: ILoaiKeHoachGiangDay): Promise<any> {
    const loaiKeHoachGiangDay = await this.loaiKeHoachGiangDayEntity.findOne({ ID, isDeleted: false });
    if (!loaiKeHoachGiangDay) {
      throw new NotFoundException();
    }

    // check Ma is exist
    const monHocByMa = await this.loaiKeHoachGiangDayEntity.findOne({ Ma: updatedData.Ma, isDeleted: false });
    if (monHocByMa) {
      throw new ConflictException();
    }

    try {
      return await this.loaiKeHoachGiangDayEntity.save({
        ...loaiKeHoachGiangDay,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async delete(ID: number, updatedBy?: number): Promise<any> {
    const loaiKeHoachGiangDay = await this.loaiKeHoachGiangDayEntity.findOne({ ID, isDeleted: false });
    if (!loaiKeHoachGiangDay) {
      throw new NotFoundException();
    }
    try {
      return await this.loaiKeHoachGiangDayEntity.save({
        ...loaiKeHoachGiangDay,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
