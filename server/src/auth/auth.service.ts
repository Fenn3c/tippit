import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SmsService } from 'src/sms/sms.service';
import { SignInAndSendCodeDto } from './dto/sign-in-sms.dto';

const PASSWORD_SALT = 10

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
        private jwtService: JwtService,
        private smsService: SmsService
    ) { }

    async signin(signInDto: SignInDto) {
        const user = await this.validateUser(signInDto.phone, signInDto.password)
        await this.smsService.verifyPhone(signInDto.phoneVerificationId, signInDto.phoneVerify)
        return this.generateToken(user)
    }

    async signinAndSendCode(signInAndSendCodeDto: SignInAndSendCodeDto) {
        const user = await this.validateUser(signInAndSendCodeDto.phone, signInAndSendCodeDto.password)
        return await this.smsService.sendSMS(user.phone)
    }

    async signup(signUpDto: SignUpDto, pfp: any) {
        if (signUpDto.password !== signUpDto.passwordConfirm) throw new BadRequestException('Пароли не совпадают')
        const existingUser = await this.userService.getUserByPhone(signUpDto.phone)
        if (existingUser) {
            throw new BadRequestException('Пользователь с таким телефоном существует')
        }
        await this.smsService.verifyPhone(signUpDto.phoneVerificationId, signUpDto.phoneVerify)
        const hashPassword = await bcrypt.hash(signUpDto.password, PASSWORD_SALT);
        const user = await this.userService.createUser({ ...signUpDto, password: hashPassword }, pfp)
        return this.generateToken(user)
    }

    private async generateToken(user: User) {
        const payload = {
            phone: user.phone,
            id: user.id
        }
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(phone: string, password: string) {
        const user = await this.userService.getUserByPhone(phone)
        if (user) {
            const passwordEquals = await bcrypt.compare(password, user.password)
            if (passwordEquals)
                return user
        }
        throw new UnauthorizedException({ message: 'Некоррекнный телефон или пароль' })
    }

}
