import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HOATDONGDAYHOC_MESSAGE, LIMIT } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { HoatDongDayHocEntity } from './entity/hoat-dong-day-hoc.entity';

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

    const results = await this.hoatDongDayHocRepository.find({
      where: query,
      skip,
      take: Number(limit),
      relations: ['createdBy', 'updatedBy']
    });
    const total = await this.hoatDongDayHocRepository.count({ ...query });
    return { contents: results, total, page: Number(page) };
  }

  async findOne(id: number): Promise<HoatDongDayHocEntity | any> {
    const result = await this.hoatDongDayHocRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['createdBy', 'updatedBy']
    });
    if (!result) {
      throw new NotFoundException(HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_ID_NOT_FOUND);
    }
    return result;
  }

  async create(newData: HoatDongDayHocEntity): Promise<any> {
    const checkExistName = await this.hoatDongDayHocRepository.findOne({ ma: newData?.ma, isDeleted: false });
    if (checkExistName) {
      throw new ConflictException(HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_EXIST);
    }
    try {
      const hoatDongDayHoc = await this.hoatDongDayHocRepository.create(newData);
      const saved = await this.hoatDongDayHocRepository.save(hoatDongDayHoc);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException(HOATDONGDAYHOC_MESSAGE.CREATE_HOATDONGDAYHOC_FAILED);
    }
  }

  async update(id: number, updatedData: HoatDongDayHocEntity): Promise<any> {
    const hoatDongDayHoc = await this.hoatDongDayHocRepository.findOne({ id, isDeleted: false });
    if (!hoatDongDayHoc) {
      throw new NotFoundException(HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_ID_NOT_FOUND);
    }

    // check Ma is exist
    const hoatDongDayHocByMa = await this.hoatDongDayHocRepository.findOne({ ma: updatedData.ma, isDeleted: false });
    if (hoatDongDayHocByMa) {
      throw new ConflictException(HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_EXIST);
    }

    try {
      return await this.hoatDongDayHocRepository.save({
        ...hoatDongDayHoc,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException(HOATDONGDAYHOC_MESSAGE.UPDATE_HOATDONGDAYHOC_FAILED);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const hoatDongDayHoc = await this.hoatDongDayHocRepository.findOne({ id, isDeleted: false });
    if (!hoatDongDayHoc) {
      throw new NotFoundException(HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_ID_NOT_FOUND);
    }
    try {
      return await this.hoatDongDayHocRepository.save({
        ...hoatDongDayHoc,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException(HOATDONGDAYHOC_MESSAGE.DELETE_HOATDONGDAYHOC_FAILED);
    }
  }
  async isInSyllabus(idHoatDongDanhGia: number, idSyllabus: number) {
    throw new InternalServerErrorException(`HOATDONGDAYHOC_${idHoatDongDanhGia}_NOT_IN_SYLLABUS`);
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.hoatDongDayHocRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(HOATDONGDAYHOC_MESSAGE.DELETE_HOATDONGDAYHOC_FAILED);
    }
  }
}
