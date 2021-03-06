import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, RESPONSE_MESSAGE } from 'constant/constant';
import { Not, Repository } from 'typeorm';
import { ChiTietKeHoachEntity } from './entity/chi-tiet-ke-hoach.entity';
import { KeHoachGiangDayService } from 'ke-hoach-giang-day/ke-hoach-giang-day.service';
import { ChiTietGomNhomService } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.service';
import { BaseFilterDto } from './dto/filter-chi-tiet-ke-hoach.dto';

@Injectable()
export class ChiTietKeHoachService {
  constructor(
    @InjectRepository(ChiTietKeHoachEntity)
    private chiTietKeHoachRepository: Repository<ChiTietKeHoachEntity>,
    private keHoachGiangDayService: KeHoachGiangDayService,
    private chiTietGomNhomService: ChiTietGomNhomService
  ) {}

  async create(newData: ChiTietKeHoachEntity) {
    const ctgn = await this.chiTietGomNhomService.findById(newData.idCTGN);
    const khgd = await this.keHoachGiangDayService.findById(newData.idKHGD);
    if (!(khgd && ctgn)) throw new ConflictException(RESPONSE_MESSAGE.FOREIGN_KEY_CONFLICT);

    try {
      const result = await this.chiTietKeHoachRepository.save({
        ...newData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filter: BaseFilterDto) {
    const { page = 0, limit = LIMIT, ...other } = filter;
    const skip = page * limit;
    try {
      const [results, total] = await this.chiTietKeHoachRepository.findAndCount({
        relations: ['idKHGD', 'idCTGN', 'createdBy', 'updatedBy'],
        skip,
        take: limit,
        ...other
      });
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    let result: any;
    try {
      result = await this.chiTietKeHoachRepository.findOne(id, {
        relations: ['idKHGD', 'idCTGN', 'createdBy', 'updatedBy'],
        where: { isDeleted: false }
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
    if (!result) throw new NotFoundException();
    return result;
  }

  async update(id: number, newData: ChiTietKeHoachEntity) {
    const oldData = await this.chiTietKeHoachRepository.findOne(id, { where: { isDeleted: false } });
    const khgd = await this.keHoachGiangDayService.findById(newData.idKHGD);
    const ctgn = await this.chiTietGomNhomService.findById(newData.idCTGN);
    if (!(khgd && ctgn)) throw new ConflictException(RESPONSE_MESSAGE.FOREIGN_KEY_CONFLICT);
    try {
      return await this.chiTietKeHoachRepository.save({ ...oldData, ...newData, updatedAt: new Date() });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, idUser: number) {
    const result = await this.chiTietKeHoachRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException();
    try {
      return await this.chiTietKeHoachRepository.save({
        ...result,
        updatedAt: new Date(),
        updatedBy: idUser,
        isDeleted: true
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
