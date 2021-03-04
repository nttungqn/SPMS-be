import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { GomNhomEntity } from './entity/gom-nhom.entity';
import { IGomNhom } from './interfaces/gom-nhom.interface';

@Injectable()
export class GomNhomService {
  constructor(@InjectRepository(GomNhomEntity) private gomNhomRepository: Repository<GomNhomEntity>) {}

  async findAll(filter): Promise<GomNhomEntity[] | any> {
    const { limit = LIMIT, page = 0, search = '', ...otherParam } = filter;
    const skip = Number(page) * Number(limit);
    const querySearch = search ? { ten: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...otherParam
    };

    try {
      const results = await this.gomNhomRepository.find({
        where: query,
        skip,
        take: Number(limit),
        relations: ['idLKKT', 'createdBy', 'updatedBy']
      });
      const total = await this.gomNhomRepository.count({ ...query });
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findById(id: number): Promise<GomNhomEntity | any> {
    const result = await this.gomNhomRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['idLKKT', 'createdBy', 'updatedBy']
    });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async create(newData: IGomNhom): Promise<any> {
    const checkExistName = await this.gomNhomRepository.findOne({ maGN: newData?.maGN, isDeleted: false });
    if (checkExistName) {
      throw new ConflictException();
    }
    try {
      const gomNhom = await this.gomNhomRepository.create(newData);
      const saved = await this.gomNhomRepository.save(gomNhom);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updatedData: IGomNhom): Promise<any> {
    const gomNhom = await this.gomNhomRepository.findOne({ id, isDeleted: false });
    if (!gomNhom) {
      throw new NotFoundException();
    }

    // check Ma is exist
    const chuDeByMa = await this.gomNhomRepository.findOne({ maGN: updatedData.maGN, isDeleted: false });
    if (chuDeByMa) {
      throw new ConflictException();
    }

    try {
      return await this.gomNhomRepository.save({
        ...gomNhom,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const gomNhom = await this.gomNhomRepository.findOne({ id, isDeleted: false });
    if (!gomNhom) {
      throw new NotFoundException();
    }
    try {
      return await this.gomNhomRepository.save({
        ...gomNhom,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
