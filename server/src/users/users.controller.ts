import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    // @Post('/create')
    // create(@Body() userDto: CreateUserDto) {
    //     return this.usersService.createUser(userDto)
    // }

    @Get('/get')
    @UseGuards(JwtAuthGuard)
    getAll() {
        return this.usersService.getAllUsers()
    }

    @Get('/user-exists')
    async userExists(@Req() request: Request) {
        const phone = request.query.phone
        if (!phone) throw new BadRequestException('Телефон не указан')
        return Boolean(await this.usersService.getUserByPhone(phone.toString()))


    }
}
