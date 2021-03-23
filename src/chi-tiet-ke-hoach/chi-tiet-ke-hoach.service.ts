import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, CHITIETKEHOACH_MESSAGE } from 'constant/constant';
import { Repository } from 'typeorm';
import { ChiTietKeHoachEntity } from './entity/chi-tiet-ke-hoach.entity';
import { KeHoachGiangDayService } from 'ke-hoach-giang-day/ke-hoach-giang-day.service';
import { ChiTietGomNhomService } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.service';
import { BaseFilterDto, FilterChiTietKeHoach } from './dto/filter-chi-tiet-ke-hoach.dto';

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
    if (!(khgd && ctgn)) throw new ConflictException(CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_FOREIGN_KEY_CONFLICT);

    try {
      const result = await this.chiTietKeHoachRepository.save({
        ...newData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.CREATE_CHITIETKEHOACH_FAILED);
    }
  }

  async findAll(filter: FilterChiTietKeHoach) {
    const { page = 0, limit = LIMIT, ...other } = filter;
    const skip = page * limit;
    const [results, total] = await this.chiTietKeHoachRepository.findAndCount({
      relations: ['idKHGD', 'idCTGN', 'createdBy', 'updatedBy', 'idCTGN.gomNhom'],
      skip,
      take: limit,
      ...other
    });
    results.forEach((e) => {
      delete e.idCTGN['gomNhom']['chiTietGomNhom'];
    });
    return { contents: results, total, page: Number(page) };
  }

  async findOne(id: number) {
    const result = await this.chiTietKeHoachRepository.findOne(id, {
      relations: ['idKHGD', 'idCTGN', 'createdBy', 'updatedBy', 'idCTGN.gomNhom'],
      where: { isDeleted: false }
    });
    if (!result) {
      throw new NotFoundException(CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_ID_NOT_FOUND);
    }
    delete result.idCTGN['gomNhom']['chiTietGomNhom'];
    return result;
  }

  async update(id: number, newData: ChiTietKeHoachEntity) {
    const oldData = await this.chiTietKeHoachRepository.findOne(id, { where: { isDeleted: false } });
    if (newData.idKHGD) await this.keHoachGiangDayService.findById(newData.idKHGD);
    if (newData.idCTGN) await this.chiTietGomNhomService.findById(newData.idCTGN);
    try {
      return await this.chiTietKeHoachRepository.save({ ...oldData, ...newData, updatedAt: new Date() });
    } catch (error) {
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.UPDATE_CHITIETKEHOACH_FAILED);
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
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.DELETE_CHITIETKEHOACH_FAILED);
    }
  }
}
