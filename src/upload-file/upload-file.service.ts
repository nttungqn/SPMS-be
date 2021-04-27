import { Injectable } from '@nestjs/common';
import { UsersService } from 'users/users.service';

@Injectable()
export class UploadFileService {
  constructor(private userService: UsersService) {}

  async updateAvatarUrl(url: string, idUser: number) {
    await this.userService.update(idUser, { avatar: url });
  }
}
