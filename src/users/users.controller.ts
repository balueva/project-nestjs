import { Body, Controller, Patch, Post, UseGuards, Req, Get, Render, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserEditDto } from './dtos/user-edit.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { registerDecorator } from 'class-validator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() user: UserCreateDto): Promise<UsersEntity> {
        return this.usersService.create(user);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async edit(@Body() user: UserEditDto, @Req() req: Request): Promise<UsersEntity> {
        //console.log('req', req);
        const jwtUserId: number = req.user['userId'];
        console.log('jwtUserId = ', jwtUserId);

        return this.usersService.edit(jwtUserId, user);
    }

    @Get('edit-profile/:id')
    @Render('profile')
    async editProfile(@Req() req: Request) {
        const usersEntity = await this.usersService.findById(+req.params['id']);

        if (!usersEntity)
            throw new HttpException('Не существует такого пользователя', HttpStatus.FORBIDDEN);

        return { user: usersEntity, title: 'lesson 06' }
    }

    @Get('roles/:id')
    async getRoles(@Req() req: Request) {
        const usersEntity = await this.usersService.findById(+req.params['id']);

        if (!usersEntity)
            throw new HttpException('Не существует такого пользователя', HttpStatus.FORBIDDEN);

        return { roles: usersEntity.roles };
    }
}
