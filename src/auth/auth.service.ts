import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { compare } from '../utils/crypto';
import { UsersEntity } from 'src/users/users.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, passwd: string): Promise<any | null> {
        const usersEntity = await this.usersService.findByEmail(email);
        if (usersEntity && (await compare(passwd, usersEntity.password))) {
            const { password, ...result } = usersEntity;
            return result;
        }
        return null;
    }

    /*
        async login(user: any) {
            const payload = user;
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
    */
    async login(user: any) {
        const payload = { email: user.username, id: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async verify(token: string) {
        return this.jwtService.verify(token);
    }
}

