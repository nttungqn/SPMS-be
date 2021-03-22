import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FE_ROUTE } from 'config/config';
import { CONFIRM_SIGNUP_PATH, LIMIT, ROLE_SINHVIEN, USER_MESSAGE } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { sendMail } from 'utils/sendMail';
import { UsersEntity } from './entity/user.entity';
import { IUser } from './interfaces/users.interface';
import { FilterUser } from './dto/filter-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>) {}

  async findAll(filter: FilterUser) {
    const { page = 0, limit = LIMIT, search = '', ...other } = filter;
    const skip = page * limit;
    const querySearch = search
      ? [
          { firstName: Like(`%${search}%`) },
          { lastName: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
          { username: Like(`%${search}%`) }
        ]
      : {};
    const query = {
      ...querySearch,
      ...other
    };

    const [results, total] = await this.usersRepository.findAndCount({
      where: query,
      relations: ['role'],
      skip,
      take: limit,
      ...other
    });
    return { contents: results, total, page: Number(page) };
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
}
