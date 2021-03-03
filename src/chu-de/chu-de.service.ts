import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { ChuDeEntity } from './entity/chu-de.entity';
import { IChuDe } from './interfaces/chuDe.interface';

@Injectable()
export class ChuDeService {
  constructor(@InjectRepository(ChuDeEntity) private chuDeRepository: Repository<ChuDeEntity>) {}

  async findAll(filter): Promise<ChuDeEntity[] | any> {
    const { limit = LIMIT, page = 0, search = '', ...otherParam } = filter;
    const skip = Number(page) * Number(limit);
    const querySearch = search ? { ten: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...otherParam
    };

    try {
      const results = await this.chuDeRepository.find({
        where: query,
        skip,
        take: Number(limit),
        relations: ['idSyllabus', 'idLKHGD', 'createdBy', 'updatedBy']
      });
      const total = await this.chuDeRepository.count({ ...query });
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findById(id: number): Promise<ChuDeEntity | any> {
    const result = await this.chuDeRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['idSyllabus', 'idLKHGD', 'createdBy', 'updatedBy']
    });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async create(newData: IChuDe): Promise<any> {
    const checkExistName = await this.chuDeRepository.findOne({ ma: newData?.ma, isDeleted: false });
    if (checkExistName) {
      throw new ConflictException();
    }
    try {
      const chude = await this.chuDeRepository.create(newData);
      const saved = await this.chuDeRepository.save(chude);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updatedData: IChuDe): Promise<any> {
    const chude = await this.chuDeRepository.findOne({ id, isDeleted: false });
    if (!chude) {
      throw new NotFoundException();
    }

    // check Ma is exist
    const chuDeByMa = await this.chuDeRepository.findOne({ ma: updatedData.ma, isDeleted: false });
    if (chuDeByMa) {
      throw new ConflictException();
    }

    try {
      return await this.chuDeRepository.save({
        ...chude,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const chude = await this.chuDeRepository.findOne({ id, isDeleted: false });
    if (!chude) {
      throw new NotFoundException();
    }
    try {
      return await this.chuDeRepository.save({
        ...chude,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
