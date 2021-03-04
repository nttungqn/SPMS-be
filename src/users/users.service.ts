import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_MESSAGE } from 'constant/constant';
import { Repository } from 'typeorm';
import { UsersEntity } from './entity/user.entity';
import { IUser } from './interfaces/users.interface';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>) {}
  async findOne(query): Promise<any> {
    return await this.usersRepository.findOne({ ...query });
  }
  async create(newData: IUser): Promise<any> {
    const newUser = await this.usersRepository.create({ ...newData, role: newData?.role || 1 });
    return await this.usersRepository.save(newUser);
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
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
