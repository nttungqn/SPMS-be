import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, CHITIETGOMNHOM_MESSAGE } from 'constant/constant';
import { Repository } from 'typeorm';
import { ChiTietGomNhomEntity } from './entity/chi-tiet-gom-nhom.entity';

@Injectable()
export class ChiTietGomNhomService {
  constructor(
    @InjectRepository(ChiTietGomNhomEntity) private chiTietGomNhomRepository: Repository<ChiTietGomNhomEntity>
  ) {}

  async findAll(filter): Promise<ChiTietGomNhomEntity[] | any> {
    const { limit = LIMIT, page = 0, search = '', ...otherParam } = filter;
    const skip = Number(page) * Number(limit);
    const query = {
      isDeleted: false,
      ...otherParam
    };

    const results = await this.chiTietGomNhomRepository.find({
      where: query,
      skip,
      take: Number(limit),
      relations: ['idGN', 'idMH', 'createdBy', 'updatedBy']
    });
    const total = await this.chiTietGomNhomRepository.count({ ...query });
    return { contents: results, total, page: Number(page) };
  }

  async findById(id: number): Promise<ChiTietGomNhomEntity | any> {
    const result = await this.chiTietGomNhomRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['idGN', 'idMH', 'createdBy', 'updatedBy']
    });
    if (!result) {
      throw new NotFoundException(CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND);
    }
    return result;
  }

  async create(newData: ChiTietGomNhomEntity): Promise<any> {
    try {
      const ctGomNhom = await this.chiTietGomNhomRepository.create(newData);
      const saved = await this.chiTietGomNhomRepository.save(ctGomNhom);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException(CHITIETGOMNHOM_MESSAGE.CREATE_CHITIETGOMNHOM_FAILED);
    }
  }

  async update(id: number, updatedData: ChiTietGomNhomEntity): Promise<any> {
    const ctGomNhom = await this.chiTietGomNhomRepository.findOne({ id, isDeleted: false });
    if (!ctGomNhom) {
      throw new NotFoundException(CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND);
    }

    try {
      return await this.chiTietGomNhomRepository.save({
        ...ctGomNhom,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException(CHITIETGOMNHOM_MESSAGE.UPDATE_CHITIETGOMNHOM_FAILED);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const ctGomNhom = await this.chiTietGomNhomRepository.findOne({ id, isDeleted: false });
    if (!ctGomNhom) {
      throw new NotFoundException(CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND);
    }
    try {
      return await this.chiTietGomNhomRepository.save({
        ...ctGomNhom,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException(CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_FAILED);
    }
  }
}
