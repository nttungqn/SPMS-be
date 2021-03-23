import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChuanDauRaNganhDaoTaoService } from 'chuan-dau-ra-nganh-dao-tao/chuan-dau-ra-nganh-dao-tao.service';
import { LIMIT, MUCTIEUMONHOC_MESSAGE } from 'constant/constant';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Not, Repository } from 'typeorm';
import { CreateMucTieuMonHocDto } from './dto/create-muc-tieu-mon-hoc.dto';
import { FilterMucTieuMonHoc } from './dto/filter-muc-tieu-mon-hoc.dto';
import { UpdateMucTieuMonHocDto } from './dto/update-muc-tieu-mon-hoc.dto';
import { MucTieuMonHocEntity } from './entity/muc-tieu-mon-hoc.entity';

@Injectable()
export class MucTieuMonHocService {
  constructor(
    @InjectRepository(MucTieuMonHocEntity)
    private mucTieuMonHocEntityRepository: Repository<MucTieuMonHocEntity>,
    private syllabusService: SyllabusService,
    private chuanDauRaNganhDaoTaoService: ChuanDauRaNganhDaoTaoService
  ) {}

  async create(newData: CreateMucTieuMonHocDto, idUser: number) {
    await this.syllabusService.findOne(newData.syllabus);

    const mucTieuMonHoc = new MucTieuMonHocEntity();
    mucTieuMonHoc.syllabus = newData.syllabus;
    mucTieuMonHoc.ma = newData.ma;
    mucTieuMonHoc.moTa = newData.moTa;

    if (await this.isExistV2(null, newData)) throw new ConflictException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_EXIST);
    if (newData.chuanDauRaCDIO) {
      mucTieuMonHoc.chuanDauRaCDIO = [];
      const uniqueId = [];
      for (const id of newData.chuanDauRaCDIO) {
        if (uniqueId.indexOf(id) === -1) {
          uniqueId.push(id);
          const chuanDaura = await this.chuanDauRaNganhDaoTaoService.findById(Number(id));
          mucTieuMonHoc.chuanDauRaCDIO.push(chuanDaura);
        }
      }
    }
    try {
      const result = await this.mucTieuMonHocEntityRepository.save({
        ...mucTieuMonHoc,
        createdAt: new Date(),
        createdBy: idUser,
        updatedAt: new Date(),
        updatedBy: idUser
      });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(MUCTIEUMONHOC_MESSAGE.CREATE_MUCTIEUMONHOC_FAILED);
    }
  }

  async findAll(filter: FilterMucTieuMonHoc) {
    const { page = 0, limit = LIMIT, idSyllabus } = filter;
    const skip = page * limit;
    const searchByIdSyllabus = idSyllabus ? { syllabus: idSyllabus } : {};
    if (idSyllabus) await this.syllabusService.findOne(idSyllabus);
    const query = {
      isDeleted: false,
      ...searchByIdSyllabus
    };
    const order = idSyllabus ? { ma: 'ASC' } : {};
    try {
      const [results, total] = await this.mucTieuMonHocEntityRepository.findAndCount({
        relations: ['createdBy', 'updatedBy', 'chuanDauRaCDIO'],
        where: query,
        skip,
        take: limit,
        ...order
      });
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    let result: any;
    try {
      result = await this.mucTieuMonHocEntityRepository.findOne(id, {
        relations: ['createdBy', 'updatedBy', 'chuanDauRaCDIO'],
        where: { isDeleted: false }
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
    if (!result) throw new NotFoundException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_ID_NOT_FOUND);
    return result;
  }

  async update(id: number, newData: UpdateMucTieuMonHocDto, idUser: number) {
    const oldData = await this.mucTieuMonHocEntityRepository.findOne(id, { where: { isDeleted: false } });
    const { chuanDauRaCDIO } = newData;
    if (await this.isExistV2(oldData, newData)) throw new ConflictException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_EXIST);
    if (chuanDauRaCDIO) {
      oldData.chuanDauRaCDIO = [];
      const uniqueId = [];
      for (const id of newData.chuanDauRaCDIO) {
        if (uniqueId.indexOf(id) === -1) {
          uniqueId.push(id);
          const chuanDaura = await this.chuanDauRaNganhDaoTaoService.findById(Number(id));
          oldData.chuanDauRaCDIO.push(chuanDaura);
        }
      }
    }
    const { ma, syllabus, moTa } = { ...oldData, ...newData };
    try {
      const result = await this.mucTieuMonHocEntityRepository.save({
        ...oldData,
        ...{ ma, syllabus, moTa },
        updatedAt: new Date(),
        updatedBy: idUser
      });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(MUCTIEUMONHOC_MESSAGE.UPDATE_MUCTIEUMONHOC_FAILED);
    }
  }

  async remove(id: number, idUser: number) {
    const result = await this.mucTieuMonHocEntityRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_ID_NOT_FOUND);
    try {
      return await this.mucTieuMonHocEntityRepository.save({
        ...result,
        updatedAt: new Date(),
        updatedBy: idUser,
        isDeleted: true
      });
    } catch (error) {
      throw new InternalServerErrorException(MUCTIEUMONHOC_MESSAGE.DELETE_MUCTIEUMONHOC_FAILED);
    }
  }

  async isExist(oldData: MucTieuMonHocEntity, newData: MucTieuMonHocEntity): Promise<boolean> {
    const { syllabus, ma }: MucTieuMonHocEntity = newData;
    if (!(syllabus || ma)) return false;
    const loaiDanhGia = { ...oldData, ...newData };
    const queryByMaAndSlylabus = { syllabus: loaiDanhGia.syllabus, ma: loaiDanhGia.ma };
    const notID = oldData?.id ? { id: Not(Number(oldData.id)) } : {};
    const query = {
      isDeleted: false,
      ...queryByMaAndSlylabus,
      ...notID
    };
    const found = await this.mucTieuMonHocEntityRepository.findOne({ where: query });
    return found ? true : false;
  }
  async isExistV2(oldData: MucTieuMonHocEntity, newData: CreateMucTieuMonHocDto): Promise<boolean> {
    if (!(newData.syllabus || newData.ma)) return false;
    const { syllabus, ma } = { ...oldData, ...newData };
    const notID = oldData?.id ? { id: Not(Number(oldData.id)) } : {};
    const queryByMaAndSlylabus = { syllabus, ma };
    const query = {
      isDeleted: false,
      ...queryByMaAndSlylabus,
      ...notID
    };
    const result = await this.mucTieuMonHocEntityRepository.findOne({ where: query });
    return result ? true : false;
  }
}
