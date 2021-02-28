import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CHUANDAURA_MESSAGE, LIMIT } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { CreateChuanDauRaDto } from './dto/createChuanDauRa.dto';
import { ChuanDauRaEntity } from './entity/chuanDauRa.entity';

@Injectable()
export class ChuanDauRaService {
  @InjectRepository(ChuanDauRaEntity) private readonly chuanDauRaRepository: Repository<ChuanDauRaEntity>;

  async findAll(filter: any): Promise<any> {
    const { limit = LIMIT, page = 0, search = '', ...rest } = filter;
    const skip = Number(page) * Number(limit);
    const querySearch = search ? { Ten: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...rest
    };
    const results = await this.chuanDauRaRepository.find({
      relations: ['createdBy', 'updatedBy'],
      skip,
      take: limit,
      where: query
    });
    if (!results.length) {
      throw new HttpException(CHUANDAURA_MESSAGE.CHUANDAURA_EMPTY, HttpStatus.NOT_FOUND);
    }
    const total = await this.chuanDauRaRepository.count({ ...query });
    return { contents: results, total, page: Number(page) };
  }

  async findById(ID: number): Promise<any> {
    const result = await this.chuanDauRaRepository.findOne({
      where: { ID, isDeleted: false },
      relations: ['createdBy', 'updatedBy']
    });
    if (!result) {
      throw new HttpException(CHUANDAURA_MESSAGE.CHUANDAURA_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async create(newData: CreateChuanDauRaDto): Promise<any> {
    const checkExistData = await this.chuanDauRaRepository.findOne({
      Ten: newData?.Ten,
      isDeleted: false
    });
    if (checkExistData) {
      throw new HttpException(CHUANDAURA_MESSAGE.CHUANDAURA_IS_EXIST, HttpStatus.CONFLICT);
    }
    try {
      const newChuanDauRa = await this.chuanDauRaRepository.create(newData);
      const saved = await this.chuanDauRaRepository.save(newChuanDauRa);
      return saved;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(ID: number, updatedData: CreateChuanDauRaDto): Promise<any> {
    const chuanDauRa = await this.chuanDauRaRepository.findOne({ ID, isDeleted: false });
    if (!chuanDauRa) {
      throw new HttpException(CHUANDAURA_MESSAGE.CHUANDAURA_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const updated = await this.chuanDauRaRepository.save({
        ...chuanDauRa,
        ...updatedData,
        updatedAt: new Date()
      });
      return updated;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(ID: number, updatedBy?: number): Promise<any> {
    const chuanDauRa = await this.chuanDauRaRepository.findOne({ ID, isDeleted: false });
    if (!chuanDauRa) {
      throw new HttpException(CHUANDAURA_MESSAGE.CHUANDAURA_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const deleted = await this.chuanDauRaRepository.save({
        ...chuanDauRa,
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
