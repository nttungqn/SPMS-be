import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, CHITIETGOMNHOM_MESSAGE } from 'constant/constant';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { Repository } from 'typeorm';
import { CreateChiTietGomNhomDTO } from './dto/create-chi-tiet-gom-nhom.dto';
import { FilterByNganhDaoTao } from './dto/filter-by-nganh-dao-tao.dto';
import { UpdateChiTietGomNhomDTO } from './dto/update-chi-tiet-gom-nhom.dto';
import { ChiTietGomNhomEntity } from './entity/chi-tiet-gom-nhom.entity';

@Injectable()
export class ChiTietGomNhomService {
  constructor(
    @InjectRepository(ChiTietGomNhomEntity) private chiTietGomNhomRepository: Repository<ChiTietGomNhomEntity>
  ) {}

  async findAll(filter): Promise<ChiTietGomNhomEntity[] | any> {
    // const [results, total] = await this.chiTietGomNhomRepository.findAndCount({
    //   where: query,
    //   skip,
    //   take: Number(limit),
    //   relations: ['createdBy', 'updatedBy', 'monHoc', 'gomNhom']
    // });
    // return { contents: results, total, page: Number(page) };

    const { limit = LIMIT, page = 0, search = '', sortBy = '', sortType = 'ASC', ...otherParam } = filter;
    const skip = Number(page) * Number(limit);
    const query = {
      isDeleted: false,
      ...otherParam
    };

    let sortByTemp = sortBy;
    if (sortByTemp != 'gomNhom.tieuDe' && sortByTemp != 'monHoc.tenTiengViet' && sortByTemp != '')
      sortByTemp = 'ctgn.' + sortByTemp;

    try {
      const queryBuilder = this.chiTietGomNhomRepository
        .createQueryBuilder('ctgn')
        .leftJoinAndSelect('ctgn.monHoc', 'monHoc')
        .leftJoinAndSelect('ctgn.gomNhom', 'gomNhom')
        .leftJoinAndSelect('ctgn.createdBy', 'createdBy')
        .leftJoinAndSelect('ctgn.updatedBy', 'updatedBy')
        .where(query);

      if (search != '') {
        queryBuilder.andWhere(
          'gomNhom.tieuDe LIKE :search OR monHoc.tenTiengViet LIKE :search OR ctgn.ghiChu LIKE :search',
          { search: `%${search}%` }
        );
      }

      const [results, total] = await queryBuilder
        .orderBy(sortByTemp, sortType)
        .skip(skip)
        .take(limit)
        .getManyAndCount();
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findById(id: number): Promise<ChiTietGomNhomEntity | any> {
    const result = await this.chiTietGomNhomRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['createdBy', 'updatedBy', 'monHoc', 'gomNhom']
    });
    if (!result) {
      throw new NotFoundException(CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND);
    }
    return result;
  }

  async create(newData: CreateChiTietGomNhomDTO, idUser: number): Promise<any> {
    const { idCTGNMonHocTruoc } = newData;
    const chiTietGomNhom: ChiTietGomNhomEntity = {
      ...newData,
      createdBy: idUser,
      updatedBy: idUser,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    if (idCTGNMonHocTruoc) {
      const ctgnMonHoctruoc = await this.chiTietGomNhomRepository.findOne({
        id: newData.idCTGNMonHocTruoc,
        isDeleted: false
      });
      if (!ctgnMonHoctruoc) {
        throw new NotFoundException(CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND);
      }
      chiTietGomNhom.ctgnMonHoctruoc = ctgnMonHoctruoc;
    }
    try {
      const ctGomNhom = await this.chiTietGomNhomRepository.create(chiTietGomNhom);
      const saved = await this.chiTietGomNhomRepository.save(ctGomNhom);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException(CHITIETGOMNHOM_MESSAGE.CREATE_CHITIETGOMNHOM_FAILED);
    }
  }

  async update(id: number, updatedData: UpdateChiTietGomNhomDTO, idUser: number): Promise<any> {
    const ctGomNhom = await this.chiTietGomNhomRepository.findOne({ id, isDeleted: false });
    if (!ctGomNhom) {
      throw new NotFoundException(CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND);
    }
    const chiTietGomNhom: ChiTietGomNhomEntity = {
      ...ctGomNhom,
      ...updatedData,
      updatedBy: idUser,
      updatedAt: new Date()
    };
    const { idCTGNMonHocTruoc } = updatedData;
    if (idCTGNMonHocTruoc) {
      const ctgnMonHoctruoc = await this.chiTietGomNhomRepository.findOne({
        id: updatedData.idCTGNMonHocTruoc,
        isDeleted: false
      });
      if (!ctgnMonHoctruoc) {
        throw new NotFoundException(CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND);
      }
      chiTietGomNhom.ctgnMonHoctruoc = ctgnMonHoctruoc;
    }
    try {
      return await this.chiTietGomNhomRepository.save(chiTietGomNhom);
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
        qb.leftJoinAndSelect('monHoc.chiTietGomNhom', 'chiTietGomNhom', 'chiTietGomNhom.isDeleted = false')
          .leftJoinAndSelect('ctgnMonHoctruoc.monHoc', 'monHocTr')
          .where(`monHocTr.id = ${idMonHoc}`);
      })
      .getMany();
    return result.map((e) => e.monHoc);
  }
  async getAllSubjects(khoa: number, idNganhDaoTao: number, filter: FilterByNganhDaoTao) {
    const { limit = LIMIT, page = 0, tenMonHoc, maMonHoc } = filter;
    const skip = Number(page) * Number(limit);
    const [results, total] = await this.chiTietGomNhomRepository
      .createQueryBuilder('ctgn')
      .leftJoinAndSelect('ctgn.createdBy', 'createdBy')
      .leftJoinAndSelect('ctgn.updatedBy', 'updatedBy')
      .leftJoinAndSelect('ctgn.monHoc', 'monHoc')
      .leftJoinAndSelect('ctgn.gomNhom', 'gomNhom')
      .where((qb) => {
        qb.where((qb) => {
          qb.innerJoin('gomNhom.loaiKhoiKienThuc', 'loaiKhoiKienThuc')
            .where((qb) => {
              qb.innerJoin('loaiKhoiKienThuc.khoiKienThuc', 'khoiKienThuc')
                .where((qb) => {
                  qb.innerJoin('khoiKienThuc.chiTietNganh', 'chiTietNganh')
                    .where(`chiTietNganh.khoa = ${khoa} and chiTietNganh.nganhDaoTao = ${idNganhDaoTao}`)
                    .andWhere(`chiTietNganh.isDeleted = ${false}`);
                })
                .andWhere(`khoiKienThuc.isDeleted = ${false}`);
            })
            .andWhere(`gomNhom.isDeleted = ${false}`);
        });
        tenMonHoc
          ? qb.andWhere(`monHoc.tenTiengViet LIKE '%${tenMonHoc}%' OR monHoc.tenTiengAnh LIKE '%${tenMonHoc}%'`)
          : {};
        maMonHoc ? qb.andWhere(`monHoc.ma LIKE '%${maMonHoc}%'`) : {};
      })
      .andWhere(`ctgn.isDeleted = ${false}`)
      .take(limit)
      .skip(skip)
      .getManyAndCount();
    return { contents: results, total, page: Number(page) };
  }

  async deleteMultipleRows(ids: string, updatedBy?: number): Promise<any> {
    const list_id = ids
      .trim()
      .split(',')
      .map((x) => +x);
    const records = await this.chiTietGomNhomRepository
      .createQueryBuilder('ctgn')
      .where('ctgn.id IN (:...ids)', { ids: list_id })
      .andWhere(`ctgn.isDeleted = ${false}`)
      .getCount();
    if (list_id.length != records) {
      throw new NotFoundException(CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND);
    }

    try {
      await this.chiTietGomNhomRepository
        .createQueryBuilder('ctgn')
        .update(ChiTietGomNhomEntity)
        .set({ isDeleted: true, updatedAt: new Date(), updatedBy })
        .andWhere('id IN (:...ids)', { ids: list_id })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_FAILED);
    }
  }

  async deleteAll(updatedBy?: number): Promise<any> {
    try {
      await this.chiTietGomNhomRepository
        .createQueryBuilder('ctgn')
        .update(ChiTietGomNhomEntity)
        .set({ isDeleted: true, updatedAt: new Date(), updatedBy })
        .where(`isDeleted = ${false}`)
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_FAILED);
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.chiTietGomNhomRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_FAILED);
    }
  }
}
