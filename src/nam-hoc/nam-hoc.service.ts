import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NAMHOC_MESSAGE } from 'constant/constant';
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
      throw new ConflictException(NAMHOC_MESSAGE.NAMHOC_EXIST);
    }
    try {
      return await this.schoolYearRepository.save(createSchoolYearDto);
    } catch (error) {
      throw new ServiceUnavailableException(NAMHOC_MESSAGE.CREATE_NAMHOC_FAILED);
    }
  }

  async findAll() {
    return { contents: await this.schoolYearRepository.find({ where: { isDeleted: false }, order: { ma: 'ASC' } }) };
  }

  async findById(id: number): Promise<NamHocEntity> {
    let found;
    try {
      found = await this.schoolYearRepository.findOne(id, { where: { isDeleted: false } });
    } catch (error) {
      throw new ServiceUnavailableException();
    }
    if (!found) {
      throw new NotFoundException(NAMHOC_MESSAGE.NAMHOC_ID_NOT_FOUND);
    }
    return found;
  }

  async update(id: number, updateSchoolYearDto: UpdateNamHocDto) {
    const found = await this.findById(id);
    await this.checkConflictException(id, updateSchoolYearDto);
    try {
      return await this.schoolYearRepository.save({ ...found, ...updateSchoolYearDto });
    } catch (error) {
      throw new ServiceUnavailableException(NAMHOC_MESSAGE.UPDATE_NAMHOC_FAILED);
    }
  }

  async remove(id: number) {
    const found = await this.findById(id);
    found.isDeleted = true;
    try {
      await this.schoolYearRepository.save(found);
    } catch (error) {
      throw new ServiceUnavailableException(NAMHOC_MESSAGE.DELETE_NAMHOC_FAILED);
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
      throw new ConflictException(NAMHOC_MESSAGE.NAMHOC_EXIST);
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.schoolYearRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(NAMHOC_MESSAGE.DELETE_NAMHOC_FAILED);
    }
  }
}
