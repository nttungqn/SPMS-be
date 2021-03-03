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
import { LIMIT } from 'constant/constant';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateTypeOfKnowledgeBlockDto } from './dto/create-type-of-knowledge-block.dto';
import { FilterTypeOfKnowledgeBlock } from './dto/filter-type-of-knowledge-block.dto';
import { TypeOfKnowledgeBlock } from './entity/type-of-knowledge-block.entity';

@Injectable()
export class TypeOfKnowledgeBlockService {
  constructor(
    @InjectRepository(TypeOfKnowledgeBlock)
    private typeOfKnowledgeBlockRepository: Repository<TypeOfKnowledgeBlock>
  ) {}

  async findAll(filter: FilterTypeOfKnowledgeBlock) {
    const { page = 0, limit = LIMIT, idKhoiKienThuc } = filter;
    const queryBy_KhoiKienThuc = idKhoiKienThuc ? { khoiKienThuc: idKhoiKienThuc } : {};
    const skip = page * limit;
    const query: TypeOfKnowledgeBlock = {
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
    if (!result) throw new NotFoundException(`${id} Khoi-kien-thuc not found`);
    return result;
  }

  async create(typeOfKnowledgeBlock: TypeOfKnowledgeBlock) {
    if (await this.isExist(typeOfKnowledgeBlock)) {
      throw new ConflictException();
    }
    let saveResult: TypeOfKnowledgeBlock;
    try {
      const createResult = this.typeOfKnowledgeBlockRepository.create({
        ...typeOfKnowledgeBlock,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      saveResult = await this.typeOfKnowledgeBlockRepository.save(createResult);
    } catch (error) {
      if (error instanceof QueryFailedError) throw new BadRequestException();
      throw new InternalServerErrorException();
    }
    return await this.typeOfKnowledgeBlockRepository.findOne(saveResult.ID);
  }

  async update(id: number, typeOfKnowledgeBlock: TypeOfKnowledgeBlock) {
    const results = await this.typeOfKnowledgeBlockRepository.findOne(id, { where: { isDeleted: false } });
    if (!results) throw new HttpException(`${id} Khoi-kien-thuc not found`, HttpStatus.NOT_FOUND);
    if (await this.isExist(typeOfKnowledgeBlock)) {
      throw new ConflictException();
    }
    try {
      return await this.typeOfKnowledgeBlockRepository.save({
        ...results,
        ...typeOfKnowledgeBlock,
        updatedAt: new Date()
      });
    } catch (error) {
      if (error instanceof QueryFailedError) throw new BadRequestException();
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, updatedBy: number) {
    const results = await this.typeOfKnowledgeBlockRepository.findOne(id, { where: { isDeleted: false } });
    if (!results) throw new HttpException(`${id} Khoi-kien-thuc not found`, HttpStatus.NOT_FOUND);
    try {
      return await this.typeOfKnowledgeBlockRepository.save({ ...results, updatedBy, updatedAt: new Date() });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  private async isExist(createTypeOfKnowledgeBlockDto: CreateTypeOfKnowledgeBlockDto): Promise<boolean> {
    return !createTypeOfKnowledgeBlockDto ? true : false;
  }
}
