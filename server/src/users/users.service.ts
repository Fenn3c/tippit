import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';

const PASSWORD_SALT = 10

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly filesService: FilesService) { }

    async createUser(dto: CreateUserDto, pfp: any) {
        const user = new User();
        user.name = dto.name
        user.surname = dto.surname
        user.phone = dto.phone
        user.password = dto.password
        let fileName = null
        try {
            fileName = await this.filesService.createImage(pfp)
        } catch (e) {
            console.error(e)
        }
        user.pfp = fileName
        user.position = dto.position
        return await this.userRepository.save(user)
    }

    async getAllUsers() {
        return await this.userRepository.find()
    }

    async getUserByPhone(phone: string) {
        return await this.userRepository.findOneBy({ phone })
    }

}
