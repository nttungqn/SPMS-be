import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, CHITIETKEHOACH_MESSAGE } from 'constant/constant';
import { Repository } from 'typeorm';
import { ChiTietKeHoachEntity } from './entity/chi-tiet-ke-hoach.entity';
import { KeHoachGiangDayService } from 'ke-hoach-giang-day/ke-hoach-giang-day.service';
import { ChiTietGomNhomService } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.service';
import { FilterChiTietKeHoach } from './dto/filter-chi-tiet-ke-hoach.dto';

@Injectable()
export class ChiTietKeHoachService {
  constructor(
    @InjectRepository(ChiTietKeHoachEntity)
    private chiTietKeHoachRepository: Repository<ChiTietKeHoachEntity>,
    private keHoachGiangDayService: KeHoachGiangDayService,
    private chiTietGomNhomService: ChiTietGomNhomService
  ) {}

  async create(newData: ChiTietKeHoachEntity) {
    const ctgn = await this.chiTietGomNhomService.findById(newData.idCTGN);
    const khgd = await this.keHoachGiangDayService.findById(newData.idKHGD);
    if (!(khgd && ctgn)) throw new ConflictException(CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_FOREIGN_KEY_CONFLICT);

    try {
      const result = await this.chiTietKeHoachRepository.save({
        ...newData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.CREATE_CHITIETKEHOACH_FAILED);
    }
  }

  async findAll(filter: FilterChiTietKeHoach) {
    const { limit = LIMIT, page = 0, search = '', sortBy = '', sortType = 'ASC', ...otherParam } = filter;
    const skip = Number(page) * Number(limit);
    const query = {
      isDeleted: false,
      ...otherParam
    };

    let sortByTemp = sortBy;
    if (sortByTemp != 'idKHGD.maKeHoach' && sortByTemp != 'idCTGN.id' && sortByTemp != '')
      sortByTemp = 'ctkhgd.' + sortByTemp;

    try {
      const queryBuilder = this.chiTietKeHoachRepository
        .createQueryBuilder('ctkhgd')
        .leftJoinAndSelect('ctkhgd.createdBy', 'createdBy')
        .leftJoinAndSelect('ctkhgd.updatedBy', 'updatedBy')
        .leftJoinAndSelect('ctkhgd.idKHGD', 'idKHGD')
        .leftJoinAndSelect('ctkhgd.idCTGN', 'idCTGN')
        .where((qb) => {
          qb.leftJoinAndSelect('idCTGN.gomNhom', 'gomNhom', `idCTGN.isDeleted = ${false}`).leftJoinAndSelect(
            'idCTGN.monHoc',
            'monHoc',
            `gomNhom.isDeleted = ${false}`
          );
        })
        .where(query);

      if (search != '') {
        queryBuilder.andWhere('idKHGD.maKeHoach LIKE :search OR idCTGN.id LIKE :search OR ctkhgd.ghiChu LIKE :search', {
          search: `%${search}%`
        });
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

  async findOne(id: number) {
    const result = await this.chiTietKeHoachRepository
      .createQueryBuilder('ctkhgd')
      .leftJoinAndSelect('ctkhgd.createdBy', 'createdBy')
      .leftJoinAndSelect('ctkhgd.updatedBy', 'updatedBy')
      .leftJoinAndSelect('ctkhgd.idKHGD', 'idKHGD')
      .leftJoinAndSelect('ctkhgd.idCTGN', 'idCTGN')
      .where((qb) => {
        qb.leftJoinAndSelect('idCTGN.gomNhom', 'gomNhom', `idCTGN.isDeleted = ${false}`).leftJoinAndSelect(
          'idCTGN.monHoc',
          'monHoc',
          `gomNhom.isDeleted = ${false}`
        );
      })
      .andWhere(`ctkhgd.id = ${id}`)
      .andWhere(`ctkhgd.isDeleted = ${false}`)
      .getOne();
    if (!result) {
      throw new NotFoundException(CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_ID_NOT_FOUND);
    }
    return result;
  }

  async update(id: number, newData: ChiTietKeHoachEntity) {
    const oldData = await this.chiTietKeHoachRepository.findOne(id, { where: { isDeleted: false } });
    if (newData.idKHGD) await this.keHoachGiangDayService.findById(newData.idKHGD);
    if (newData.idCTGN) await this.chiTietGomNhomService.findById(newData.idCTGN);
    try {
      return await this.chiTietKeHoachRepository.save({ ...oldData, ...newData, updatedAt: new Date() });
    } catch (error) {
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.UPDATE_CHITIETKEHOACH_FAILED);
    }
  }

  async remove(id: number, idUser: number) {
    const result = await this.chiTietKeHoachRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException();
    try {
      return await this.chiTietKeHoachRepository.save({
        ...result,
        updatedAt: new Date(),
        updatedBy: idUser,
        isDeleted: true
      });
    } catch (error) {
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.DELETE_CHITIETKEHOACH_FAILED);
    }
  }
  async findAllWithSelectField(filter) {
    const { page = 0, limit = LIMIT, select = '', ...other } = filter;
    const query = {
      isDeleted: false,
      ...other
    };
    const results = await this.chiTietKeHoachRepository.find({
      relations: select ? select?.split(',') : [],
      where: query
    });
    return results;
  }

  async deleteMultipleRows(ids: string, updatedBy?: number): Promise<any> {
    const list_id = ids
      .trim()
      .split(',')
      .map((x) => +x);
    const records = await this.chiTietKeHoachRepository
      .createQueryBuilder('ctkh')
      .where('ctkh.id IN (:...ids)', { ids: list_id })
      .andWhere(`ctkh.isDeleted = ${false}`)
      .getCount();
    if (list_id.length != records) {
      throw new NotFoundException(CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_ID_NOT_FOUND);
    }

    try {
      await this.chiTietKeHoachRepository
        .createQueryBuilder('ctkh')
        .update(ChiTietKeHoachEntity)
        .set({ isDeleted: true, updatedAt: new Date(), updatedBy })
        .andWhere('id IN (:...ids)', { ids: list_id })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.DELETE_CHITIETKEHOACH_FAILED);
    }
  }

  async deleteAll(updatedBy?: number): Promise<any> {
    try {
      await this.chiTietKeHoachRepository
        .createQueryBuilder('ctgn')
        .update(ChiTietKeHoachEntity)
        .set({ isDeleted: true, updatedAt: new Date(), updatedBy })
        .where(`isDeleted = ${false}`)
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.DELETE_CHITIETKEHOACH_FAILED);
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.chiTietKeHoachRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.DELETE_CHITIETKEHOACH_FAILED);
    }
  }
}
