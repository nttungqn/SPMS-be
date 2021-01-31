import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface'

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(':username')
    async findByUsername(@Param('username') username): Promise<User> {
        return await this.usersService.findByUsername(username);
    }
}
