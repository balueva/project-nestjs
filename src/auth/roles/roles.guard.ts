import { Injectable, CanActivate, ExecutionContext, NestMiddleware, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles)
            return true;

        const { headers } = context.switchToHttp().getRequest();
        const { authorization } = headers;

        // из токена убираем приставку Мишка
        const user = authorization ? await this.authService.verify(authorization.split(' ')[1]) : null;
        if (!user)
            return false;

        const usersEntity = await this.usersService.findById(user.id);
        return requiredRoles.some((role) => usersEntity.roles === role);
    }
}