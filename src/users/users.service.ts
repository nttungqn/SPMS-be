import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TABLE_NAME } from 'constant/constant';
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
    const newUser = await this.usersRepository.create({ ...newData });
    return await this.usersRepository.save(newUser);
  }
  async getProfile(query): Promise<any> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.role', 'roles')
      .where('users.id = :ID and users.email = :email', { ...query })
      .getOne();
  }
}
