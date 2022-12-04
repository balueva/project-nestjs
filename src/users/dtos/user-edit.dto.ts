import { IsNotEmpty, IsString, IsEmail, ValidateIf } from 'class-validator';
import { Role } from 'src/auth/roles/role.enum';

export class UserEditDto {
    @ValidateIf(o => o.firstName)
    @IsString()
    firstName: string;

    @ValidateIf(o => o.lastName)
    @IsString()
    lastName: string;

    @ValidateIf(o => o.email)
    @IsEmail()
    email: string;

    @ValidateIf(o => o.password)
    @IsString()
    password: string;

    @ValidateIf(o => o.roles)
    @IsString()
    roles: Role;

    @ValidateIf(o => o.avatar)
    @IsString()
    avatar: string
}