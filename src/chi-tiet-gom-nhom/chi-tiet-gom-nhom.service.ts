import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, CHITIETGOMNHOM_MESSAGE } from 'constant/constant';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { Repository } from 'typeorm';
import { ChiTietGomNhomEntity } from './entity/chi-tiet-gom-nhom.entity';

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
        relations: ['createdBy', 'updatedBy']
      });
      const total = await this.chiTietGomNhomRepository.count({ ...query });
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findById(id: number): Promise<ChiTietGomNhomEntity | any> {
    const result = await this.chiTietGomNhomRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['createdBy', 'updatedBy']
    });
    if (!result) {
      throw new NotFoundException(CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND);
    }
    return result;
  }

  async create(newData: ChiTietGomNhomEntity): Promise<any> {
    try {
      const ctGomNhom = await this.chiTietGomNhomRepository.create(newData);
      const saved = await this.chiTietGomNhomRepository.save(ctGomNhom);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException(CHITIETGOMNHOM_MESSAGE.CREATE_CHITIETGOMNHOM_FAILED);
    }
  }

  async update(id: number, updatedData: ChiTietGomNhomEntity): Promise<any> {
    const ctGomNhom = await this.chiTietGomNhomRepository.findOne({ id, isDeleted: false });
    if (!ctGomNhom) {
      throw new NotFoundException(CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND);
    }

    try {
      return await this.chiTietGomNhomRepository.save({
        ...ctGomNhom,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException(CHITIETGOMNHOM_MESSAGE.UPDATE_CHITIETGOMNHOM_FAILED);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const ctGomNhom = await this.chiTietGomNhomRepository.findOne({ id, isDeleted: false });
    if (!ctGomNhom) {
      throw new NotFoundException(CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND);
    }
    try {
      return await this.chiTietGomNhomRepository.save({
        ...ctGomNhom,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException(CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_FAILED);
    }
  }

  async getMonHocThayThe(idMonHoc: number): Promise<MonHocEntity[]> {
    const result = await this.chiTietGomNhomRepository
      .createQueryBuilder('ctgn')
      .leftJoinAndSelect('ctgn.ctgnMonHoctruoc', 'ctgnMonHoctruoc')
      .leftJoinAndSelect('ctgn.monHoc', 'monHoc')
      .where((qb) => {
        qb.leftJoinAndSelect('ctgnMonHoctruoc.monHoc', 'monHocTr').where(`monHocTr.id = ${idMonHoc}`);
      })
      .getMany();
    return result.map((e) => e.monHoc);
  }
}
