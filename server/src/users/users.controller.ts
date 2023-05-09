import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }


    @Get()
    @UseGuards(JwtAuthGuard)
    getAll() {
        return this.usersService.getAllUsers()
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    findMe(@Req() req) {
        return this.usersService.getUserById(req.user.id);
    }
    @Get('/user-exists')
    async userExists(@Req() request: Request) {
        const phone = request.query.phone
        if (!phone) throw new BadRequestException('Телефон не указан')
        return Boolean(await this.usersService.getUserByPhone(phone.toString()))
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.getPublicUserById(id);
    }

    @Patch('/password')
    @UseGuards(JwtAuthGuard)
    updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Req() req) {
        return this.usersService.updatePassword(updatePasswordDto, req.user.id);
    }


    @Patch()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('pfp'))
    update(@Body() updateUserDto: UpdateUserDto, @UploadedFile() pfp, @Req() req) {
        return this.usersService.update(updateUserDto, req.user.id, pfp);
    }


}
