import { Injectable, NotFoundException } from '@nestjs/common';
import { User} from './interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,) {}

  async findByUsername(username: string): Promise<User> {
    const results = await this.userRepository.findOne({username: username})
    if (!results) {
      throw new NotFoundException('Could not find any user');
    }
    return results;
  }
}
