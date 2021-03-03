import { ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHeDaoTaoDto } from './dto/create-he-dao-tao.dto';
import { UpdateHeDaoTaoDto } from './dto/update-he-dao-tao.dto';
import { HeDaoTaoEntity } from './entity/type-of-education.entity';

@Injectable()
export class HeDaotaoService {
  constructor(
    @InjectRepository(HeDaoTaoEntity)
    private typeOfEduRepository: Repository<HeDaoTaoEntity>
  ) {}

  async create(createTypeOfEducationDto: CreateHeDaoTaoDto) {
    if (await this.isExist(createTypeOfEducationDto)) {
      throw new ConflictException();
    }
    try {
      return await this.typeOfEduRepository.save(createTypeOfEducationDto);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async findAll() {
    return await this.typeOfEduRepository.find({ where: { isDeleted: false }, order: { ma: 'ASC' } });
  }

  async findById(id: number): Promise<HeDaoTaoEntity> {
    let found;
    try {
      found = await this.typeOfEduRepository.findOne(id, { where: { isDeleted: false } });
    } catch (error) {
      throw new ServiceUnavailableException();
    }
    if (!found) {
      throw new NotFoundException(`id: ${id} not found`);
    }
    return found;
  }

  async update(id: number, updateTypeOfEducationDto: UpdateHeDaoTaoDto) {
    const found = await this.findById(id);
    await this.checkConflictException(id, updateTypeOfEducationDto);
    try {
      return await this.typeOfEduRepository.save({ ...found, ...updateTypeOfEducationDto });
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async remove(id: number) {
    const found = await this.findById(id);
    found.isDeleted = true;
    try {
      await this.typeOfEduRepository.save(found);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
  private async isExist(createTypeOfEducationDto: CreateHeDaoTaoDto): Promise<boolean> {
    const { ma, ten } = createTypeOfEducationDto;
    const found = await this.typeOfEduRepository.findOne({
      where: [
        { ma: ma, isDeleted: false },
        { ten: ten, isDeleted: false }
      ]
    });
    return found ? true : false;
  }
  private async checkConflictException(id: number, createTypeOfEducationDto: CreateHeDaoTaoDto) {
    const { ma, ten } = createTypeOfEducationDto;
    const query = this.typeOfEduRepository.createQueryBuilder('tod');
    query.andWhere('(tod.code=:code OR tod.name=:name)', { ma, ten });
    query.andWhere('(tod.isDeleted=:isDeleted AND tod.id!=:id)', { isDeleted: false, id });
    const found = await query.getOne();
    if (found) {
      throw new ConflictException();
    }
  }
}
