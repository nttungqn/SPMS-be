import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HOATDONGDAYHOC_MESSAGE, LIMIT } from 'constant/constant';
import { Repository } from 'typeorm';
import { FilterHoatDongDayHoc } from './dto/filter-hoat-đong-day-hoc';
import { HoatDongDayHocEntity } from './entity/hoat-dong-day-hoc.entity';

@Injectable()
export class HoatDongDayHocService {
  constructor(
    @InjectRepository(HoatDongDayHocEntity) private hoatDongDayHocRepository: Repository<HoatDongDayHocEntity>
  ) {}

  async findAll(filter: FilterHoatDongDayHoc): Promise<HoatDongDayHocEntity[] | any> {
    const { limit = LIMIT, page = 0, searchKey = '', sortBy, sortType } = filter;
    const skip = Number(page) * Number(limit);
    const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
    const [results, total] = await this.hoatDongDayHocRepository
      .createQueryBuilder('hddh')
      .leftJoinAndSelect('hddh.createdBy', 'createdBy')
      .leftJoinAndSelect('hddh.updatedBy', 'updatedBy')
      .where((qb) => {
        searchKey
          ? qb.andWhere('hddh.ma LIKE :search OR hddh.ten LIKE :search', {
              search: `%${searchKey}%`
            })
          : {};
        isSortFieldInForeignKey ? qb.orderBy(sortBy, sortType) : qb.orderBy(sortBy ? `hddh.${sortBy}` : null, sortType);
      })
      .skip(skip)
      .take(limit)
      .andWhere('hddh.isDeleted = false')
      .getManyAndCount();
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
}
