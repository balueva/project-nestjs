import { IsNotEmpty, IsString, IsEmail, ValidateIf } from 'class-validator';
import { Role } from 'src/auth/roles/role.enum';

export class UserCreateDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    roles: Role;

    @ValidateIf(o => o.avatar)
    @IsString()
    avatar: string
}