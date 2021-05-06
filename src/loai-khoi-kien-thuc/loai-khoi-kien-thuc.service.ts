import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, LOAIKHOIKIENTHUC_MESSAGE, REDIS_CACHE_VARS } from 'constant/constant';
import { OrderByCondition, QueryFailedError, Repository } from 'typeorm';
import { CreateLoaiKhoiKienThucDto } from './dto/create-loai-khoi-kien-thuc.dto';
import { FilterLoaiKhoiKienThuc } from './dto/filter-loai-khoi-kien-thuc.dto';
import { LoaiKhoiKienThucEntity } from './entity/type-of-knowledge-block.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class LoaiKhoiKienThucService {
  constructor(
    @InjectRepository(LoaiKhoiKienThucEntity)
    private typeOfKnowledgeBlockRepository: Repository<LoaiKhoiKienThucEntity>,
    private cacheManager: RedisCacheService
  ) {}

  async findAll(filter: FilterLoaiKhoiKienThuc) {
    const key = format(REDIS_CACHE_VARS.LIST_LKKT_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const { page = 0, limit = LIMIT, idKhoiKienThuc, createdAt } = filter;
      const queryBy_KhoiKienThuc = idKhoiKienThuc ? { khoiKienThuc: idKhoiKienThuc } : {};
      const queryOrder: OrderByCondition = createdAt ? { createdAt } : {};
      const skip = page * limit;
      const query = {
        isDeleted: false,
        ...queryBy_KhoiKienThuc
      };
      const [list, total] = await this.typeOfKnowledgeBlockRepository.findAndCount({
        relations: ['khoiKienThuc', 'createdBy', 'updatedBy'],
        where: query,
        take: limit,
        skip,
        order: queryOrder
      });
      result = { contents: list, total, page: page };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_LKKT_CACHE_TTL);
    }
    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findOne(id: number) {
    let result;
    try {
      result = await this.typeOfKnowledgeBlockRepository.findOne(id, {
        relations: ['khoiKienThuc', 'createdBy', 'updatedBy'],
        where: { isDeleted: false }
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
    if (!result) throw new NotFoundException(LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_ID_NOT_FOUND);
    return result;
  }
  async findDetail(id: number) {
    let result: LoaiKhoiKienThucEntity;
    try {
      result = await this.typeOfKnowledgeBlockRepository
        .createQueryBuilder('lkkt')
        .leftJoinAndSelect('lkkt.createdBy', 'createdBy')
        .leftJoinAndSelect('lkkt.updatedBy', 'updatedBy')
        .leftJoinAndSelect('lkkt.gomNhom', 'gomNhom', `gomNhom.isDeleted = ${false}`)
        .leftJoinAndSelect('lkkt.khoiKienThuc', 'khoiKienThuc', `khoiKienThuc.isDeleted = ${false}`)
        .where((qb) => {
          qb.leftJoinAndSelect('gomNhom.chiTietGomNhom', 'chiTietGomNhom').where((qb) => {
            qb.leftJoinAndSelect('chiTietGomNhom.monHoc', 'monHoc');
          });
        })
        .andWhere(`lkkt.id = ${id}`)
        .andWhere(`lkkt.isDeleted = ${false}`)
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
    if (!result) throw new NotFoundException(LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_ID_NOT_FOUND);
    return result;
  }
  async create(typeOfKnowledgeBlock: LoaiKhoiKienThucEntity) {
    if (await this.isExist(typeOfKnowledgeBlock)) {
      throw new ConflictException(LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_EXIST);
    }
    let saveResult: LoaiKhoiKienThucEntity;
    try {
      const createResult = this.typeOfKnowledgeBlockRepository.create({
        ...typeOfKnowledgeBlock,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      saveResult = await this.typeOfKnowledgeBlockRepository.save(createResult);
    } catch (error) {
      if (error instanceof QueryFailedError) throw new BadRequestException();
      throw new InternalServerErrorException(LOAIKHOIKIENTHUC_MESSAGE.CREATE_LOAIKHOIKIENTHUC_FAILED);
    }
    return await this.typeOfKnowledgeBlockRepository.findOne(saveResult.id);
  }

  async update(id: number, typeOfKnowledgeBlock: LoaiKhoiKienThucEntity) {
    const results = await this.typeOfKnowledgeBlockRepository.findOne(id, { where: { isDeleted: false } });
    if (!results) throw new HttpException(LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
    if (await this.isExist(typeOfKnowledgeBlock)) {
      throw new ConflictException(LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_EXIST);
    }
    try {
      return await this.typeOfKnowledgeBlockRepository.save({
        ...results,
        ...typeOfKnowledgeBlock,
        updatedAt: new Date()
      });
    } catch (error) {
      if (error instanceof QueryFailedError) throw new BadRequestException();
      throw new InternalServerErrorException(LOAIKHOIKIENTHUC_MESSAGE.UPDATE_LOAIKHOIKIENTHUC_FAILED);
    }
  }

  async remove(id: number, updatedBy: number) {
    const results = await this.typeOfKnowledgeBlockRepository.findOne(id, { where: { isDeleted: false } });
    if (!results) throw new HttpException(LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
    try {
      return await this.typeOfKnowledgeBlockRepository.save({
        ...results,
        isDeleted: true,
        updatedBy,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException(LOAIKHOIKIENTHUC_MESSAGE.DELETE_LOAIKHOIKIENTHUC_FAILED);
    }
  }
  private async isExist(createTypeOfKnowledgeBlockDto: CreateLoaiKhoiKienThucDto): Promise<boolean> {
    return !createTypeOfKnowledgeBlockDto ? true : false;
  }
  async findAllWithHaveSelectField(filter: any) {
    const { page = 0, limit = LIMIT, idKhoiKienThuc, createdAt, select = '' } = filter;
    const queryBy_KhoiKienThuc = idKhoiKienThuc ? { khoiKienThuc: idKhoiKienThuc } : {};
    const queryOrder: OrderByCondition = createdAt ? { createdAt } : {};
    const query = {
      isDeleted: false,
      ...queryBy_KhoiKienThuc
    };
    const [results, total] = await this.typeOfKnowledgeBlockRepository.findAndCount({
      relations: select ? select?.split(',') : [],
      where: query,
      order: queryOrder
    });
    return results;
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.typeOfKnowledgeBlockRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(LOAIKHOIKIENTHUC_MESSAGE.DELETE_LOAIKHOIKIENTHUC_FAILED);
    }
  }
}
