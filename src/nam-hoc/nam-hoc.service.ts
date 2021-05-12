import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NAMHOC_MESSAGE, REDIS_CACHE_VARS } from 'constant/constant';
import { Repository } from 'typeorm';
import { CreateNamHocDto } from './dto/create-nam-hoc.dto';
import { UpdateNamHocDto } from './dto/update-nam-hoc.dto';
import { NamHocEntity } from './entity/nam-hoc.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class NamHocService {
  constructor(
    @InjectRepository(NamHocEntity)
    private schoolYearRepository: Repository<NamHocEntity>,
    private cacheManager: RedisCacheService
  ) {}
  async create(createSchoolYearDto: CreateNamHocDto): Promise<NamHocEntity> {
    if (await this.isExist(createSchoolYearDto)) {
      throw new ConflictException(NAMHOC_MESSAGE.NAMHOC_EXIST);
    }
    try {
      const result = await this.schoolYearRepository.save(createSchoolYearDto);
      const key = format(REDIS_CACHE_VARS.DETAIL_NAM_HOC_CACHE_KEY, result?.id.toString());
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_NAM_HOC_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new ServiceUnavailableException(NAMHOC_MESSAGE.CREATE_NAMHOC_FAILED);
    }
  }

  async findAll() {
    const key = REDIS_CACHE_VARS.LIST_NAM_HOC_CACHE_KEY;
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const list = await this.schoolYearRepository.find({ where: { isDeleted: false }, order: { ma: 'ASC' } });
      result = { contents: list };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_NAM_HOC_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findById(id: number): Promise<NamHocEntity> {
    const key = format(REDIS_CACHE_VARS.DETAIL_NAM_HOC_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      try {
        result = await this.schoolYearRepository.findOne(id, { where: { isDeleted: false } });
      } catch (error) {
        throw new ServiceUnavailableException();
      }
      if (!result) {
        throw new NotFoundException(NAMHOC_MESSAGE.NAMHOC_ID_NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_NAM_HOC_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async update(id: number, updateSchoolYearDto: UpdateNamHocDto) {
    const found = await this.findById(id);
    await this.checkConflictException(id, updateSchoolYearDto);
    try {
      const result = await this.schoolYearRepository.save({ ...found, ...updateSchoolYearDto });
      const key = format(REDIS_CACHE_VARS.DETAIL_NAM_HOC_CACHE_KEY, result?.id.toString());
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_NAM_HOC_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new ServiceUnavailableException(NAMHOC_MESSAGE.UPDATE_NAMHOC_FAILED);
    }
  }

  async remove(id: number) {
    const found = await this.findById(id);
    found.isDeleted = true;
    try {
      const result = this.schoolYearRepository.save(found);
      const key = format(REDIS_CACHE_VARS.DETAIL_NAM_HOC_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return result;
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

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_NAM_HOC_CACHE_KEY]);
  }
}
