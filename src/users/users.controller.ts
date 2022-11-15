import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { UserCreateDto } from './dtos/user-create.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() user: UserCreateDto): Promise<UsersEntity> {
        return this.usersService.create(user);
    }
}
