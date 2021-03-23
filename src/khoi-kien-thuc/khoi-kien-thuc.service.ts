import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KHOIKIENTHUC_MESSAGE, LIMIT } from 'constant/constant';
import { Repository } from 'typeorm';
import { CreateKhoiKienThucDto } from './dto/create-khoi-kien-thuc.dto';
import { filterKnowledgeBlock } from './dto/filter-khoi-kien-thuc.dto';
import { KhoiKienThucEntity } from './entity/khoi-kien-thuc.entity';

@Injectable()
export class KhoiKienThucService {
  constructor(
    @InjectRepository(KhoiKienThucEntity)
    private knowledgeBlockRepository: Repository<KhoiKienThucEntity>
  ) {}

  async create(knowledgeBlock: KhoiKienThucEntity) {
    if (await this.isExist(knowledgeBlock)) {
      throw new ConflictException(KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_EXIST);
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
      throw new InternalServerErrorException(KHOIKIENTHUC_MESSAGE.CREATE_KHOIKIENTHUC_FAILED);
    }
  }

  async findAll(filter: filterKnowledgeBlock) {
    const { page = 0, limit = LIMIT, idChiTietNganhDaoTao } = filter;
    const queryByChiTietNganhDaoTao = idChiTietNganhDaoTao ? { chiTietNganh: idChiTietNganhDaoTao } : {};
    const skip = page * limit;
    const [results, total] = await this.knowledgeBlockRepository.findAndCount({
      relations: ['chiTietNganh', 'createdBy', 'updatedBy'],
      where: { isDeleted: false, ...queryByChiTietNganhDaoTao },
      skip,
      take: limit
    });
    return { contents: results, total, page: Number(page) };
  }

  async findOne(id: number) {
    const result = await this.knowledgeBlockRepository.findOne(id, {
      relations: ['chiTietNganh', 'createdBy', 'updatedBy'],
      where: { isDeleted: false }
    });
    if (!result) throw new NotFoundException(KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_ID_NOT_FOUND);
    return result;
  }

  async update(id: number, knowledgeBlock: KhoiKienThucEntity) {
    const result = await this.knowledgeBlockRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException(KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_ID_NOT_FOUND);
    const { tinChiBatBuoc, tinChiTuChonTuDo, tinChiTuChon } = knowledgeBlock;
    const type: { tinChiBatBuoc: number; tinChiTuChonTuDo: number; tinChiTuChon: number } = {
      tinChiBatBuoc,
      tinChiTuChonTuDo,
      tinChiTuChon
    };
    Object.keys(type).forEach((key) => {
      if (type[key]) result.tongTinChi += type[key] - result[key];
    });
    try {
      await this.knowledgeBlockRepository.save({ ...result, ...knowledgeBlock, updatedAt: new Date() });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(KHOIKIENTHUC_MESSAGE.UPDATE_KHOIKIENTHUC_FAILED);
    }
  }

  async remove(idUser: number, id: number) {
    const result = await this.knowledgeBlockRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException(KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_ID_NOT_FOUND);
    try {
      return await this.knowledgeBlockRepository.save({
        ...result,
        updatedAt: new Date(),
        updatedBy: idUser,
        isDeleted: true
      });
    } catch (error) {
      throw new InternalServerErrorException(KHOIKIENTHUC_MESSAGE.DELETE_KHOIKIENTHUC_FAILED);
    }
  }

  async isExist(createKhoiKienThucDto: CreateKhoiKienThucDto): Promise<boolean> {
    return createKhoiKienThucDto ? true : false;
  }
  getAllByNganhDaoTaoAndKhoaTuyen(idNganhDaotao: number, khoa: number) {
    this.knowledgeBlockRepository.createQueryBuilder('kkt');
    //.leftJoin('kkt')
  }
}
