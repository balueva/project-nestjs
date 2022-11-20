import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/roles/role.enum';
import { hash } from 'src/utils/crypto';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserEditDto } from './dtos/user-edit.dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
    ) { }

    async create(user: UserCreateDto) {
        const userEntity = new UsersEntity();
        userEntity.firstName = user.firstName;
        userEntity.lastName = user.lastName;
        userEntity.email = user.email;
        userEntity.roles = user.roles;
        userEntity.password = await hash(user.password);

        return await this.usersRepository.save(userEntity);
    }

    async findById(id: number): Promise<UsersEntity | null> {
        return await this.usersRepository.findOneBy({ id });
    }

    async findByEmail(email: string): Promise<UsersEntity | null> {
        return await this.usersRepository.findOneBy({ email });
    }

    async edit(id: number, user: UserEditDto): Promise<UsersEntity> {
        const userEntity = await this.findById(id);
        //console.log('id = ', id, userEntity);

        userEntity.firstName = user.firstName || userEntity.firstName;
        userEntity.lastName = user.lastName || userEntity.lastName;
        userEntity.email = user.email || userEntity.email;
        userEntity.password = (await hash(user.password)) || userEntity.password;
        if (userEntity.roles.includes(Role.Admin)) {
            userEntity.roles = user.roles || userEntity.roles;
        }
        //userEntity.avatar = user.avatar || userEntity.avatar;

        return await this.usersRepository.save(userEntity);
    }
}
