import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GOMNHOM_MESSAGE, LIMIT } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { GomNhomEntity } from './entity/gom-nhom.entity';

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
      throw new NotFoundException(GOMNHOM_MESSAGE.GOMNHOM_ID_NOT_FOUND);
    }
    return result;
  }

  async create(newData: GomNhomEntity): Promise<any> {
    const checkExistName = await this.gomNhomRepository.findOne({ maGN: newData?.maGN, isDeleted: false });
    if (checkExistName) {
      throw new ConflictException(GOMNHOM_MESSAGE.GOMNHOM_EXIST);
    }
    try {
      const gomNhom = await this.gomNhomRepository.create(newData);
      const saved = await this.gomNhomRepository.save(gomNhom);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.CREATE_GOMNHOM_FAILED);
    }
  }

  async update(id: number, updatedData: GomNhomEntity): Promise<any> {
    const gomNhom = await this.gomNhomRepository.findOne({ id, isDeleted: false });
    if (!gomNhom) {
      throw new NotFoundException(GOMNHOM_MESSAGE.GOMNHOM_ID_NOT_FOUND);
    }

    // check Ma is exist
    const chuDeByMa = await this.gomNhomRepository.findOne({ maGN: updatedData.maGN, isDeleted: false });
    if (chuDeByMa) {
      throw new ConflictException(GOMNHOM_MESSAGE.GOMNHOM_EXIST);
    }

    try {
      return await this.gomNhomRepository.save({
        ...gomNhom,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.UPDATE_GOMNHOM_FAILED);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const gomNhom = await this.gomNhomRepository.findOne({ id, isDeleted: false });
    if (!gomNhom) {
      throw new NotFoundException(GOMNHOM_MESSAGE.GOMNHOM_ID_NOT_FOUND);
    }
    try {
      return await this.gomNhomRepository.save({
        ...gomNhom,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.DELETE_GOMNHOM_FAILED);
    }
  }
  async findAllWithSelectField(filter): Promise<GomNhomEntity[] | any> {
    const { limit = LIMIT, page = 0, search = '', select = '', ...otherParam } = filter;
    const querySearch = search ? { ten: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...otherParam
    };

    try {
      const results = await this.gomNhomRepository.find({
        where: query,
        relations: select ? select?.split(',') : []
      });
      return results;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
