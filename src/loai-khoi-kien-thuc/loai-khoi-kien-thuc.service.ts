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
import { LIMIT, LOAIKHOIKIENTHUC_MESSAGE } from 'constant/constant';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateLoaiKhoiKienThucDto } from './dto/create-loai-khoi-kien-thuc.dto';
import { FilterLoaiKhoiKienThuc } from './dto/filter-loai-khoi-kien-thuc.dto';
import { LoaiKhoiKienThucEntity } from './entity/type-of-knowledge-block.entity';

@Injectable()
export class LoaiKhoiKienThucService {
  constructor(
    @InjectRepository(LoaiKhoiKienThucEntity)
    private typeOfKnowledgeBlockRepository: Repository<LoaiKhoiKienThucEntity>
  ) {}

  async findAll(filter: FilterLoaiKhoiKienThuc) {
    const { page = 0, limit = LIMIT, idKhoiKienThuc } = filter;
    const queryBy_KhoiKienThuc = idKhoiKienThuc ? { khoiKienThuc: idKhoiKienThuc } : {};
    const skip = page * limit;
    const query: LoaiKhoiKienThucEntity = {
      isDeleted: false,
      ...queryBy_KhoiKienThuc
    };
    const [results, total] = await this.typeOfKnowledgeBlockRepository.findAndCount({
      relations: ['khoiKienThuc', 'createdBy', 'updatedBy'],
      where: query,
      take: limit,
      skip
    });
    return { contents: results, total, page: page };
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
      return await this.typeOfKnowledgeBlockRepository.save({ ...results, updatedBy, updatedAt: new Date() });
    } catch (error) {
      throw new InternalServerErrorException(LOAIKHOIKIENTHUC_MESSAGE.DELETE_LOAIKHOIKIENTHUC_FAILED);
    }
  }
  private async isExist(createTypeOfKnowledgeBlockDto: CreateLoaiKhoiKienThucDto): Promise<boolean> {
    return !createTypeOfKnowledgeBlockDto ? true : false;
  }
}
