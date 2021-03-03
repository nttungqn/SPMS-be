import { ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNamHocDto } from './dto/create-nam-hoc.dto';
import { UpdateNamHocDto } from './dto/update-nam-hoc.dto';
import { NamHocEntity } from './entity/nam-hoc.entity';

@Injectable()
export class NamHocService {
  constructor(
    @InjectRepository(NamHocEntity)
    private schoolYearRepository: Repository<NamHocEntity>
  ) {}
  async create(createSchoolYearDto: CreateNamHocDto): Promise<NamHocEntity> {
    if (await this.isExist(createSchoolYearDto)) {
      throw new ConflictException();
    }
    try {
      return await this.schoolYearRepository.save(createSchoolYearDto);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async findAll() {
    return await this.schoolYearRepository.find({ where: { isDeleted: false }, order: { ma: 'ASC' } });
  }

  async findById(id: number): Promise<NamHocEntity> {
    let found;
    try {
      found = await this.schoolYearRepository.findOne(id, { where: { isDeleted: false } });
    } catch (error) {
      throw new ServiceUnavailableException();
    }
    if (!found) {
      throw new NotFoundException(`id: ${id} not found`);
    }
    return found;
  }

  async update(id: number, updateSchoolYearDto: UpdateNamHocDto) {
    const found = await this.findById(id);
    await this.checkConflictException(id, updateSchoolYearDto);
    try {
      return await this.schoolYearRepository.save({ ...found, ...updateSchoolYearDto });
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async remove(id: number) {
    const found = await this.findById(id);
    found.isDeleted = true;
    try {
      await this.schoolYearRepository.save(found);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  private async isExist(createSchoolYearDto: CreateNamHocDto): Promise<boolean> {
    const { ma, ten } = createSchoolYearDto;
    const found = await this.schoolYearRepository.findOne({
      where: [
        { ma: ma, isDeleted: false },
        { ten: ten, isDeleted: false }
      ]
    });
    return found ? true : false;
  }
  private async checkConflictException(id: number, updateSchoolYearDto: UpdateNamHocDto) {
    const { ma, ten } = updateSchoolYearDto;
    const query = this.schoolYearRepository.createQueryBuilder('sy');
    query.andWhere('(sy.ma=:ma OR sy.ten=:ten)', { ma, ten });
    query.andWhere('(sy.isDeleted=:isDeleted AND sy.id!=:id)', { isDeleted: false, id });
    const found = await query.getOne();
    if (found) {
      throw new ConflictException();
    }
  }
}
