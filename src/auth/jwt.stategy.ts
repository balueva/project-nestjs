import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConst } from './const';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractFromCookies]),
            //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConst.secret,
        });
    }

    private static extractFromCookies(req: Request) {
        return req.cookies && 'jwt' in req.cookies ? req.cookies.jwt : null;
    }

    async validate(payload: any) {
        return { userId: payload.id };
    }
}
