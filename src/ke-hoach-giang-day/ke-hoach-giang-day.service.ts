import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KEHOACHGIANGDAY_MESSAGE, LIMIT } from 'constant/constant';
import { Repository } from 'typeorm';
import { CreateKeHoachGiangDayDto } from './dto/createKeHoachGiangDay.dto';
import { KeHoachGiangDayEntity } from './entity/keHoachGiangDay.entity';

@Injectable()
export class KeHoachGiangDayService {
  @InjectRepository(KeHoachGiangDayEntity)
  private readonly keHoachGiangDayRepository: Repository<KeHoachGiangDayEntity>;

  async findAll(filter: any): Promise<any> {
    const { limit = LIMIT, page = 0, ...rest } = filter;
    const skip = Number(page) * Number(limit);
    const query = {
      isDeleted: false,
      ...rest
    };
    const results = await this.keHoachGiangDayRepository.find({
      relations: ['nganhDaoTao', 'createdBy', 'updatedBy', 'nganhDaoTao.chuongTrinhDaoTao'],
      skip,
      take: limit,
      where: query
    });
    if (!results.length) {
      throw new HttpException(KEHOACHGIANGDAY_MESSAGE.KEHOACHGIANGDAY_EMPTY, HttpStatus.NOT_FOUND);
    }
    const total = await this.keHoachGiangDayRepository.count({ ...query });
    return { contents: results, total, page: Number(page) };
  }

  async findById(id: number): Promise<any> {
    const result = await this.keHoachGiangDayRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['NganhDaoTao', 'createdBy', 'updatedBy', 'nganhDaoTao.chuongTrinhDaoTao']
    });
    if (!result) {
      throw new HttpException(KEHOACHGIANGDAY_MESSAGE.KEHOACHGIANGDAY_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async create(newData: CreateKeHoachGiangDayDto): Promise<any> {
    const checkExist = await this.keHoachGiangDayRepository.findOne({
      maKeHoach: newData?.maKeHoach,
      isDeleted: false
    });
    if (checkExist) {
      throw new HttpException(KEHOACHGIANGDAY_MESSAGE.KEHOACHGIANGDAY_MESSAGE_MAKEHOACH_CONFLIC, HttpStatus.CONFLICT);
    }
    try {
      const newKeHoachGiangDay = await this.keHoachGiangDayRepository.create(newData);
      const saved = await this.keHoachGiangDayRepository.save(newKeHoachGiangDay);
      return saved;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updatedData: CreateKeHoachGiangDayDto): Promise<any> {
    const keHoachGiangDay = await this.keHoachGiangDayRepository.findOne({ id, isDeleted: false });
    if (!keHoachGiangDay) {
      throw new HttpException(KEHOACHGIANGDAY_MESSAGE.KEHOACHGIANGDAY_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const updated = await this.keHoachGiangDayRepository.save({
        ...keHoachGiangDay,
        ...updatedData,
        updatedAt: new Date()
      });
      return updated;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const keHoachGiangDay = await this.keHoachGiangDayRepository.findOne({ id, isDeleted: false });
    if (!keHoachGiangDay) {
      throw new HttpException(KEHOACHGIANGDAY_MESSAGE.KEHOACHGIANGDAY_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const deleted = await this.keHoachGiangDayRepository.save({
        ...keHoachGiangDay,
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
