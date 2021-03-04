import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, MUCTIEUMONHOC_MESSAGE } from 'constant/constant';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Repository } from 'typeorm';
import { CreateMucTieuMonHocDto } from './dto/create-muc-tieu-mon-hoc.dto';
import { FilterMucTieuMonHoc } from './dto/filter-muc-tieu-mon-hoc.dto';
import { UpdateMucTieuMonHocDto } from './dto/update-muc-tieu-mon-hoc.dto';
import { MucTieuMonHocEntity } from './entity/muc-tieu-mon-hoc.entity';

@Injectable()
export class MucTieuMonHocService {
  constructor(
    @InjectRepository(MucTieuMonHocEntity)
    private mucTieuMonHocEntityRepository: Repository<MucTieuMonHocEntity>,
    private syllabusService: SyllabusService
  ) {}

  create(createMucTieuMonHocDto: CreateMucTieuMonHocDto) {
    return 'This action adds a new mucTieuMonHoc';
  }

  async findAll(filter: FilterMucTieuMonHoc) {
    const { page = 0, limit = LIMIT, idSyllabus } = filter;
    const skip = page * limit;
    const searchByIdSyllabus: MucTieuMonHocEntity = idSyllabus ? { syllabus: idSyllabus } : {};
    if (idSyllabus) await this.syllabusService.findOne(idSyllabus);
    const query: MucTieuMonHocEntity = {
      isDeleted: false,
      ...searchByIdSyllabus
    };
    try {
      const [results, total] = await this.mucTieuMonHocEntityRepository.findAndCount({
        relations: [
          'syllabus',
          'createdBy',
          'updatedBy',
          'syllabus.monHoc',
          'syllabus.createdBy',
          'syllabus.updatedBy',
          'syllabus.heDaoTao',
          'syllabus.namHoc'
        ],
        where: query,
        skip,
        take: limit
      });
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} mucTieuMonHoc`;
  }

  update(id: number, updateMucTieuMonHocDto: UpdateMucTieuMonHocDto) {
    return `This action updates a #${id} mucTieuMonHoc`;
  }

  remove(id: number) {
    return `This action removes a #${id} mucTieuMonHoc`;
  }
}
