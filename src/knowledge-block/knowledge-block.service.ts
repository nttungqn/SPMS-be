import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { Repository } from 'typeorm';
import { CreateKnowledgeBlockDto } from './dto/create-knowledge-block.dto';
import { filterKnowledgeBlock } from './dto/filter-knowledge-block.dto';
import { KnowledgeBlock } from './entity/knowledge-block.entity';

@Injectable()
export class KnowledgeBlockService {
  constructor(
    @InjectRepository(KnowledgeBlock)
    private knowledgeBlockRepository: Repository<KnowledgeBlock>
  ) {}

  async create(knowledgeBlock: KnowledgeBlock) {
    if (await this.isExist(knowledgeBlock)) {
      throw new ConflictException();
    }
    const { tinChiBatBuoc = 0, tinChiTuChonTuDo = 0, tinChiTuChon = 0 } = knowledgeBlock;
    knowledgeBlock.tongTinChi = tinChiBatBuoc + tinChiTuChonTuDo + tinChiTuChon;
    try {
      const result = await this.knowledgeBlockRepository.save({
        ...knowledgeBlock,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(filter: filterKnowledgeBlock) {
    const { page = 0, limit = LIMIT } = filter;
    const skip = page * limit;
    const [results, total] = await this.knowledgeBlockRepository.findAndCount({
      relations: ['chiTietNganh'],
      where: { isDeleted: false },
      skip,
      take: limit
    });
    return { contents: results, total, page: Number(page) };
  }

  async findOne(id: number) {
    const result = await this.knowledgeBlockRepository.findOne(id, {
      relations: ['chiTietNganh'],
      where: { isDeleted: false }
    });
    if (!result) throw new NotFoundException();
    return result;
  }

  async update(id: number, knowledgeBlock: KnowledgeBlock) {
    const result = await this.knowledgeBlockRepository.findOne(id, { where: { isDeleted: false } });
    console.log(knowledgeBlock);
    if (!result) throw new NotFoundException();
    const { tinChiBatBuoc, tinChiTuChonTuDo, tinChiTuChon } = knowledgeBlock;
    const type: { tinChiBatBuoc; tinChiTuChonTuDo; tinChiTuChon } = { tinChiBatBuoc, tinChiTuChonTuDo, tinChiTuChon };
    Object.keys(type).forEach((key) => {
      if (type[key]) result.tongTinChi += type[key] - result[key];
    });
    try {
      await this.knowledgeBlockRepository.save({ ...result, ...knowledgeBlock, updatedAt: new Date() });
      return this.findOne(result.id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(idUser: number, id: number) {
    const result = await this.knowledgeBlockRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException();
    try {
      return await this.knowledgeBlockRepository.save({
        ...result,
        updatedAt: new Date(),
        updatedBy: idUser,
        isDeleted: true
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async isExist(createKnowledgeBlockDto: CreateKnowledgeBlockDto): Promise<boolean> {
    return createKnowledgeBlockDto ? true : false;
  }
}
