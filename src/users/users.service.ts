import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FE_ROUTE } from 'config/config';
import { CONFIRM_SIGNUP_PATH, LIMIT, REDIS_CACHE_VARS, ROLE_SINHVIEN, USER_MESSAGE } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { sendMail } from 'utils/sendMail';
import { UsersEntity } from './entity/user.entity';
import { IUser } from './interfaces/users.interface';
import { FilterUser } from './dto/filter-user.dto';
import { Role } from 'guards/roles.enum';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
    private cacheManager: RedisCacheService
  ) {}

  async findAll(filter: FilterUser) {
    const key = format(REDIS_CACHE_VARS.LIST_USER_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      try {
        const { page = 0, limit = LIMIT, search = '', sortBy = '', sortType = '', ...otherParams } = filter;
        const other = { isDeleted: false, ...otherParams };
        if (other.isActive) other.isActive = String(other.isActive) === 'true';
        const skip = Number(page) * Number(limit);
        const querySearch = search
          ? [
              { firstName: Like(`%${search}%`), ...other },
              { lastName: Like(`%${search}%`), ...other },
              { email: Like(`%${search}%`), ...other },
              { username: Like(`%${search}%`), ...other }
            ]
          : { ...other };

        let sortQuery = {};
        if (sortBy && sortType) {
          switch (sortBy) {
            case 'id':
              sortQuery = { id: sortType };
              break;
            case 'firstName':
              sortQuery = { firstName: sortType };
              break;
            case 'lastName':
              sortQuery = { lastName: sortType };
              break;
            case 'email':
              sortQuery = { email: sortType };
              break;
            case 'updatedAt':
              sortQuery = { updatedAt: sortType };
              break;
            case 'createdAt':
              sortQuery = { createdAt: sortType };
              break;
            case 'username':
              sortQuery = { username: sortType };
              break;
            default:
              break;
          }
        }
        const [list, total] = await this.usersRepository.findAndCount({
          where: querySearch,
          relations: ['role'],
          order: sortQuery,
          skip,
          take: limit,
          ...other
        });
        result = { contents: list, total, page: Number(page) };
        await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_USER_CACHE_TTL);
      } catch (error) {
        return new InternalServerErrorException(USER_MESSAGE.INTERAL_SERVER_ERROR);
      }
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findOne(query): Promise<any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_USER_CACHE_KEY, JSON.stringify(query));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      result = await this.usersRepository.findOne({ ...query });
      if (!result) {
        throw new NotFoundException(USER_MESSAGE.EMAIL_IS_NOT_EXIST);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_USER_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async create(newData: IUser): Promise<any> {
    try {
      const newUser = await this.usersRepository.create({ ...newData, role: ROLE_SINHVIEN });
      const dataMail = {
        receiverName: `${newData?.firstName || ''} ${newData?.lastName || ''}`,
        message1: 'Your new account has been created. Welcome to Study Program Management System',
        link: `${FE_ROUTE}${CONFIRM_SIGNUP_PATH.replace(':token', newData?.tokenVerifyEmail)}`,
        buttonText: 'CONFIRM',
        message2: 'From now on, please confirm to your account',
        message3: 'Thank you!',
        author: 'SPMS Team'
      };
      await sendMail(newData?.email, 'Confirm Register Account', dataMail);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }
  async getProfile(query): Promise<any> {
    const key = format(REDIS_CACHE_VARS.PROFILE_USER_CACHE_KEY, JSON.stringify(query));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      result = await this.usersRepository
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.role', 'roles')
        .where(
          'users.id = :id and users.email = :email and users.isDeleted = :isDeleted and users.isActive = :isActive',
          { ...query, isDeleted: false, isActive: true }
        )
        .getOne();
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.PROFILE_USER_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async update(id: number, updateData): Promise<any> {
    const user = await this.usersRepository.findOne({ id, isDeleted: false });
    if (!user) {
      throw new HttpException(USER_MESSAGE.USER_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    try {
      const updated = await this.usersRepository.save({
        ...user,
        ...updateData,
        updatedAt: new Date()
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_USER_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.findOne(updated.id);
      await this.delCacheAfterChange();
      return updated;
    } catch (error) {
      throw new InternalServerErrorException(USER_MESSAGE.UPDATE_USER_FAILED);
    }
  }
  async getCountUser(type: Role) {
    const query = this.usersRepository
      .createQueryBuilder('users')
      .leftJoin('users.role', 'roles')
      .where((qb) => {
        qb.where('roles.value = :value', { value: Number(type) });
      })
      .andWhere('users.isDeleted = :isDeleted and users.isActive = :isActive', { isDeleted: false, isActive: true });
    return await query.getCount();
  }
  async remove(id: number, idUser: number) {
    const data = await this.usersRepository.findOne(id, { where: { isDeleted: false } });
    if (!data) throw new NotFoundException(USER_MESSAGE.USER_ID_NOT_FOUND);
    try {
      const result = await this.usersRepository.save({
        ...data,
        updatedAt: new Date(),
        updatedBy: idUser,
        isDeleted: true
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_USER_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(USER_MESSAGE.DELETE_USER_FAILED);
    }
  }

  async deleteAll() {
    try {
      await this.delCacheAfterChange();
      return await this.usersRepository.createQueryBuilder('users').update().set({ isDeleted: true }).execute();
    } catch (error) {
      throw new InternalServerErrorException(USER_MESSAGE.DELETE_ALL_USER_FAILED);
    }
  }

  async deleteMutipleUsers(ids: Array<number>) {
    try {
      await this.delCacheAfterChange();
      return await this.usersRepository
        .createQueryBuilder('users')
        .update()
        .set({ isDeleted: true })
        .andWhere('users.ID IN (:...ids)');
    } catch (error) {
      throw new InternalServerErrorException(USER_MESSAGE.DELETE_ALL_USER_FAILED);
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.usersRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(USER_MESSAGE.DELETE_USER_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_USER_CACHE_COMMON_KEY]);
  }

  async createUserNotConfirm(newData) {
    const userEmail = await this.usersRepository.findOne({ email: newData?.email, isDeleted: false });
    if (userEmail) {
      return { message: 'EMAIL_EXISTS' };
    }
    const userUsername = await this.usersRepository.findOne({ username: newData?.username, isDeleted: false });
    if (userUsername) {
      return { message: 'USERNAME_EXISTS' };
    }

    const newUser = await this.usersRepository.create({ ...newData });
    const user = await this.usersRepository.save(newUser);
    return user;
  }
}
