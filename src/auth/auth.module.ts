import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConst } from './const';
import { JwtStrategy } from './jwt.stategy';

@Module({
  imports: [forwardRef(() => UsersModule), PassportModule,
  JwtModule.register({
    secret: jwtConst.secret,
    signOptions: { expiresIn: '1h' },
  }),],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]

})
export class AuthModule { }
