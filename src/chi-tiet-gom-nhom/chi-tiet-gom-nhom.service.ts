import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { ChiTietGomNhomEntity } from './entity/chi-tiet-gom-nhom.entity';
import { IChiTietGomNhom } from './interfaces/chi-tiet-gom-nhom.interface';

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

    try {
      const results = await this.chiTietGomNhomRepository.find({
        where: query,
        skip,
        take: Number(limit),
        relations: ['idGN', 'idMH', 'createdBy', 'updatedBy', 'monHoc']
      });
      const total = await this.chiTietGomNhomRepository.count({ ...query });
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findById(id: number): Promise<ChiTietGomNhomEntity | any> {
    const result = await this.chiTietGomNhomRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['idGN', 'idMH', 'createdBy', 'updatedBy']
    });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async create(newData: IChiTietGomNhom): Promise<any> {
    try {
      const ctGomNhom = await this.chiTietGomNhomRepository.create(newData);
      const saved = await this.chiTietGomNhomRepository.save(ctGomNhom);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updatedData: IChiTietGomNhom): Promise<any> {
    const ctGomNhom = await this.chiTietGomNhomRepository.findOne({ id, isDeleted: false });
    if (!ctGomNhom) {
      throw new NotFoundException();
    }

    try {
      return await this.chiTietGomNhomRepository.save({
        ...ctGomNhom,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const ctGomNhom = await this.chiTietGomNhomRepository.findOne({ id, isDeleted: false });
    if (!ctGomNhom) {
      throw new NotFoundException();
    }
    try {
      return await this.chiTietGomNhomRepository.save({
        ...ctGomNhom,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
