import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CHUDE_MESSAGE, LIMIT } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { ChuDeEntity } from './entity/chu-de.entity';

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

    const results = await this.chuDeRepository.find({
      where: query,
      skip,
      take: Number(limit),
      relations: ['createdBy', 'updatedBy', 'hoatDongDanhGia', 'chuanDauRaMonHoc', 'hoatDongDayHoc']
    });
    const total = await this.chuDeRepository.count({ ...query });
    return { contents: results, total, page: Number(page) };
  }

  async findById(id: number): Promise<ChuDeEntity | any> {
    const result = await this.chuDeRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['createdBy', 'updatedBy', 'hoatDongDanhGia', 'chuanDauRaMonHoc', 'hoatDongDayHoc']
    });
    if (!result) {
      throw new NotFoundException(CHUDE_MESSAGE.CHUDE_ID_NOT_FOUND);
    }
    return result;
  }

  async create(newData: ChuDeEntity): Promise<any> {
    const checkExistName = await this.chuDeRepository.findOne({ ma: newData?.ma, isDeleted: false });
    if (checkExistName) {
      throw new ConflictException(CHUDE_MESSAGE.CHUDE_EXIST);
    }
    try {
      const chude = await this.chuDeRepository.create(newData);
      const saved = await this.chuDeRepository.save(chude);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException(CHUDE_MESSAGE.CREATE_CHUDE_FAILED);
    }
  }

  async update(id: number, updatedData: ChuDeEntity): Promise<any> {
    const chude = await this.chuDeRepository.findOne({ id, isDeleted: false });
    if (!chude) {
      throw new NotFoundException(CHUDE_MESSAGE.CHUDE_ID_NOT_FOUND);
    }

    // check Ma is exist
    const chuDeByMa = await this.chuDeRepository.findOne({ ma: updatedData.ma, isDeleted: false });
    if (chuDeByMa) {
      throw new ConflictException(CHUDE_MESSAGE.CHUDE_EXIST);
    }

    try {
      return await this.chuDeRepository.save({
        ...chude,
        ...updatedData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorException(CHUDE_MESSAGE.CREATE_CHUDE_FAILED);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const chude = await this.chuDeRepository.findOne({ id, isDeleted: false });
    if (!chude) {
      throw new NotFoundException(CHUDE_MESSAGE.CHUDE_ID_NOT_FOUND);
    }
    try {
      return await this.chuDeRepository.save({
        ...chude,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
    } catch (error) {
      throw new InternalServerErrorException(CHUDE_MESSAGE.DELETE_CHUDE_FAILED);
    }
  }
}
