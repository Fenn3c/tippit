import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

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
    async getUserById(id: number) {
        return await this.userRepository.findOneBy({ id })
    }
    async getPublicUserById(id: number) {
        const publicUser = await this.userRepository.findOneBy({ id })
        delete publicUser.password
        delete publicUser.phone
        return publicUser
    }

    async update(updateUserDto: UpdateUserDto, userId: number, pfp: any) {

        if (!userId) throw new UnauthorizedException('Пользователь не найден')
        const user = await this.getUserById(userId)
        if (!user) throw new UnauthorizedException('Пользователь не найден')
        if (updateUserDto.name) user.name = updateUserDto.name
        if (updateUserDto.surname) user.surname = updateUserDto.surname
        if (updateUserDto.position) user.position = updateUserDto.position

        let fileName = null
        if (pfp) {
            try {
                fileName = await this.filesService.createImage(pfp)
            } catch (e) {
                console.error(e)
            }
        }
        if (fileName) {
            if (user.pfp) await this.filesService.deleteFile(user.pfp)
            user.pfp = fileName
        }
        return this.userRepository.save(user)

    }


    async updatePassword(updatePasswordDto: UpdatePasswordDto, userId: number) {

        if (!userId) throw new UnauthorizedException('Пользователь не найден')
        const user = await this.getUserById(userId)
        const passwordEquals = await bcrypt.compare(updatePasswordDto.password, user.password)
        if (!passwordEquals) throw new UnauthorizedException('Неверный пароль')
        if (updatePasswordDto.newPassword !== updatePasswordDto.newPasswordConfirm) throw new BadRequestException('Пароли не совпадают')
        const hashPassword = await bcrypt.hash(updatePasswordDto.newPassword, PASSWORD_SALT);
        return this.userRepository.save({ ...user, password: hashPassword })

    }

}
