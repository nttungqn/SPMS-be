import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { HoatDongDayHocEntity } from './entity/hoat-dong-day-hoc.entity';
import { IHoatDongDayHoc } from './interfaces/hoat-dong-day-hoc.interface';

@Injectable()
export class HoatDongDayHocService {
  constructor(
    @InjectRepository(HoatDongDayHocEntity) private hoatDongDayHocRepository: Repository<HoatDongDayHocEntity>
  ) {}

  async findAll(filter): Promise<HoatDongDayHocEntity[] | any> {
    const { limit = LIMIT, page = 0, search = '', ...otherParam } = filter;
    const skip = Number(page) * Number(limit);
    const querySearch = search ? { ten: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...otherParam
    };

    try {
      const results = await this.hoatDongDayHocRepository.find({
        where: query,
        skip,
        take: Number(limit),
        relations: ['idCD', 'createdBy', 'updatedBy']
      });
      const total = await this.hoatDongDayHocRepository.count({ ...query });
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findById(id: number): Promise<HoatDongDayHocEntity | any> {
    const result = await this.hoatDongDayHocRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['idCD', 'createdBy', 'updatedBy']
    });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async create(newData: IHoatDongDayHoc): Promise<any> {
    const checkExistName = await this.hoatDongDayHocRepository.findOne({ ma: newData?.ma, isDeleted: false });
    if (checkExistName) {
      throw new ConflictException();
    }
    try {
      const hoatDongDayHoc = await this.hoatDongDayHocRepository.create(newData);
      const saved = await this.hoatDongDayHocRepository.save(hoatDongDayHoc);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updatedData: IHoatDongDayHoc): Promise<any> {
    const hoatDongDayHoc = await this.hoatDongDayHocRepository.findOne({ id, isDeleted: false });
    if (!hoatDongDayHoc) {
      throw new NotFoundException();
    }

    // check Ma is exist
    const hoatDongDayHocByMa = await this.hoatDongDayHocRepository.findOne({ ma: updatedData.ma, isDeleted: false });
    if (hoatDongDayHocByMa) {
      throw new ConflictException();
    }

    try {
      return await this.hoatDongDayHocRepository.save({
        ...hoatDongDayHoc,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const hoatDongDayHoc = await this.hoatDongDayHocRepository.findOne({ id, isDeleted: false });
    if (!hoatDongDayHoc) {
      throw new NotFoundException();
    }
    try {
      return await this.hoatDongDayHocRepository.save({
        ...hoatDongDayHoc,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
