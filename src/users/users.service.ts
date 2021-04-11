import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FE_ROUTE } from 'config/config';
import { CONFIRM_SIGNUP_PATH, LIMIT, ROLE_SINHVIEN, USER_MESSAGE } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { sendMail } from 'utils/sendMail';
import { UsersEntity } from './entity/user.entity';
import { IUser } from './interfaces/users.interface';
import { FilterUser } from './dto/filter-user.dto';
import { Role } from 'guards/roles.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>) {}

  async findAll(filter: FilterUser) {
    try {
      const { page = 0, limit = LIMIT, search = '', sortBy = '', sortType = '', ...other } = filter;
      if (other.isDeleted) other.isDeleted = String(other.isDeleted) === 'true';
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
      const [results, total] = await this.usersRepository.findAndCount({
        where: querySearch,
        relations: ['role'],
        order: sortQuery,
        skip,
        take: limit,
        ...other
      });
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      return new InternalServerErrorException(USER_MESSAGE.INTERAL_SERVER_ERROR);
    }
  }

  async findOne(query): Promise<any> {
    return await this.usersRepository.findOne({ ...query });
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
    return await this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.role', 'roles')
      .where(
        'users.id = :id and users.email = :email and users.isDeleted = :isDeleted and users.isActive = :isActive',
        { ...query, isDeleted: false, isActive: true }
      )
      .getOne();
  }

  async update(id: number, updateData): Promise<any> {
    const user = await this.usersRepository.findOne({ id, isDeleted: false });
    if (!user) {
      throw new HttpException(USER_MESSAGE.USER_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const updated = await this.usersRepository.save({
        ...user,
        ...updateData,
        updatedAt: new Date()
      });
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
    const result = await this.usersRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException(USER_MESSAGE.USER_ID_NOT_FOUND);
    try {
      return await this.usersRepository.save({
        ...result,
        updatedAt: new Date(),
        updatedBy: idUser,
        isDeleted: true
      });
    } catch (error) {
      throw new InternalServerErrorException(USER_MESSAGE.DELETE_USER_FAILED);
    }
  }

  async deleteAll() {
    try {
      return await this.usersRepository.createQueryBuilder('users').update().set({ isDeleted: true }).execute();
    } catch (error) {
      throw new InternalServerErrorException(USER_MESSAGE.DELETE_ALL_USER_FAILED);
    }
  }

  async deleteMutipleUsers(ids: Array<number>) {
    try {
      return await this.usersRepository
        .createQueryBuilder('users')
        .update()
        .set({ isDeleted: true })
        .andWhere('users.ID IN (:...ids)');
    } catch (error) {
      throw new InternalServerErrorException(USER_MESSAGE.DELETE_ALL_USER_FAILED);
    }
  }
}
