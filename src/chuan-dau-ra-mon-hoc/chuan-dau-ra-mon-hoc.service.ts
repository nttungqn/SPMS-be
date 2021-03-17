import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { Repository } from 'typeorm';
import { CreateChuanDauRaMonHocDto } from './dto/create-chuan-dau-ra-mon-hoc.dto';
import { FilterChuanDauRaMonHocDto } from './dto/filter-chuan-dau-ra-mon-hoc.dto';
import { UpdateChuanDauRaMonHocDto } from './dto/update-chuan-dau-ra-mon-hoc.dto';
import { ChuanDauRaMonHocEntity } from './entity/chuan-dau-ra-mon-hoc.entity';

@Injectable()
export class ChuanDauRaMonHocService {
  constructor(
    @InjectRepository(ChuanDauRaMonHocEntity)
    private chuanDauRaMonHocService: Repository<ChuanDauRaMonHocEntity>
  ) {}

  create(createChuanDauRaMonHocDto: CreateChuanDauRaMonHocDto) {
    return 'This action adds a new chuanDauRaMonHoc';
  }

  async findAll(filter: FilterChuanDauRaMonHocDto) {
    const { page = 0, limit = LIMIT, idMucTieuMonHoc, idSyllabus } = filter;
    const skip = page * limit;

    if (!(idMucTieuMonHoc && idMucTieuMonHoc)) {
      const [results, total] = await await this.chuanDauRaMonHocService.findAndCount({
        where: { isDeleted: false },
        skip,
        take: limit,
        order: { ma: 'ASC' }
      });
      return { contents: results, total, page: page };
    } else {
      const queryByIdMucTieuMonHoc: ChuanDauRaMonHocEntity = idMucTieuMonHoc ? { idMTMH: idMucTieuMonHoc } : {};
      const queryByIdSyllabus: ChuanDauRaMonHocEntity = idSyllabus ? {} : {};
      return `This action returns all chuanDauRaMonHoc`;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} chuanDauRaMonHoc`;
  }

  update(id: number, updateChuanDauRaMonHocDto: UpdateChuanDauRaMonHocDto) {
    return `This action updates a #${id} chuanDauRaMonHoc`;
  }

  remove(id: number) {
    return `This action removes a #${id} chuanDauRaMonHoc`;
  }
}
