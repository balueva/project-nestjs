import { Controller, Get, Post, Res, UseGuards, Render, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
        const { access_token, id } = await this.authService.login(req.user);
        response.cookie('jwt', access_token, { httpOnly: true });
        response.cookie('userId', id);
        return access_token;
    }

    @Get('login')
    @Render('login')
    async renderLogin() {
        return { title: 'Lesson 07 Авторизация' }
    }
}
