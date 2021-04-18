import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GOMNHOM_MESSAGE, LIMIT } from 'constant/constant';
import { LoaiKhoiKienThucService } from 'loai-khoi-kien-thuc/loai-khoi-kien-thuc.service';
import { Like, Repository } from 'typeorm';
import { GomNhomEntity } from './entity/gom-nhom.entity';

@Injectable()
export class GomNhomService {
  constructor(
    @InjectRepository(GomNhomEntity) private gomNhomRepository: Repository<GomNhomEntity>,
    private loaiKhoiKienThucService: LoaiKhoiKienThucService
  ) {}

  async findAll(filter): Promise<GomNhomEntity[] | any> {
    let { sortBy = '' } = filter;
    const { limit = LIMIT, page = 0, search = '', sortType = 'ASC', ...otherParam } = filter;
    const skip = Number(page) * Number(limit);
    const query = {
      isDeleted: false,
      ...otherParam
    };

    if (sortBy != 'idLKKT.ten' && sortBy != '') sortBy = 'gn.' + sortBy;

    try {
      const queryBuilder = this.gomNhomRepository
        .createQueryBuilder('gn')
        .leftJoinAndSelect('gn.idLKKT', 'idLKKT')
        .leftJoinAndSelect('gn.createdBy', 'createdBy')
        .leftJoinAndSelect('gn.updatedBy', 'updatedBy')
        .leftJoinAndSelect('gn.chiTietGomNhom', 'chiTietGomNhom')
        .where((qb) => {
          qb.leftJoinAndSelect('chiTietGomNhom.monHoc', 'monHoc');
        })
        .andWhere(query);

      if (search != '') {
        queryBuilder.andWhere(
          'idLKKT.ten LIKE :search OR gn.maGN LIKE :search OR gn.stt LIKE :search OR gn.soTCBB LIKE :search OR gn.loaiNhom LIKE :search OR gn.tieuDe LIKE :search',
          { search: `%${search}%` }
        );
      }

      const [results, total] = await queryBuilder.orderBy(sortBy, sortType).skip(skip).take(limit).getManyAndCount();
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findById(id: number): Promise<GomNhomEntity | any> {
    const result = await this.gomNhomRepository
      .createQueryBuilder('gn')
      .leftJoinAndSelect('gn.idLKKT', 'idLKKT')
      .leftJoinAndSelect('gn.createdBy', 'createdBy')
      .leftJoinAndSelect('gn.updatedBy', 'updatedBy')
      .leftJoinAndSelect('gn.chiTietGomNhom', 'chiTietGomNhom')
      .where((qb) => {
        qb.leftJoinAndSelect('chiTietGomNhom.monHoc', 'monHoc');
      })
      .andWhere(`gn.id = ${id}`)
      .andWhere(`gn.isDeleted = ${false}`)
      .getOne();
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
    const record = await this.loaiKhoiKienThucService.findOne(newData.idLKKT);
    if (!record) {
      throw new ConflictException(GOMNHOM_MESSAGE.GOMNHOM_FOREIGN_KEY_CONFLICT);
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
    const querySearch = search ? { tieuDe: Like(`%${search}%`) } : {};
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
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.DELETE_GOMNHOM_FAILED);
    }
  }

  async deleteMultipleRows(ids: string, updatedBy?: number): Promise<any> {
    const list_id = ids
      .trim()
      .split(',')
      .map((x) => +x);
    const records = await this.gomNhomRepository
      .createQueryBuilder('gn')
      .where('gn.id IN (:...ids)', { ids: list_id })
      .andWhere(`gn.isDeleted = ${false}`)
      .getCount();
    if (list_id.length != records) {
      throw new NotFoundException(GOMNHOM_MESSAGE.GOMNHOM_ID_NOT_FOUND);
    }

    try {
      await this.gomNhomRepository
        .createQueryBuilder('gn')
        .update(GomNhomEntity)
        .set({ isDeleted: true, updatedAt: new Date(), updatedBy })
        .andWhere('id IN (:...ids)', { ids: list_id })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.DELETE_GOMNHOM_FAILED);
    }
  }

  async deleteAll(updatedBy?: number): Promise<any> {
    try {
      await this.gomNhomRepository
        .createQueryBuilder('gn')
        .update(GomNhomEntity)
        .set({ isDeleted: true, updatedAt: new Date(), updatedBy })
        .where(`isDeleted = ${false}`)
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.DELETE_GOMNHOM_FAILED);
    }
  }
}
