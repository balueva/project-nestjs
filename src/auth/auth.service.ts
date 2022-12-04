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

    async login(user: any) {
        const payload = { email: user.username, id: user.id };
        console.log('login payload', payload);
        return {
            access_token: this.jwtService.sign(payload),
            id: user.id
        };
    }

    async verify(token: string) {
        return this.jwtService.verify(token);
    }

    async decode(token: string) {
        return this.jwtService.decode(token);
    }
}

