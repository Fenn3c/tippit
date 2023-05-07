import { Body, Controller, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignInAndSendCodeDto } from './dto/sign-in-sms.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('/signin-sms')
    signinSms(@Body() signInAndSendCodeDto: SignInAndSendCodeDto) {
        return this.authService.signinAndSendCode(signInAndSendCodeDto)
    }

    @Post('/signin')
    async signin(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
        const { token } = await this.authService.signin(signInDto)
        res.cookie('auth_token', token, { maxAge: 600_000_000, httpOnly: true })
    }

    @Post('/signup')
    @UseInterceptors(FileInterceptor('pfp'))
    signup(@Body() signUpDto: SignUpDto, @UploadedFile() pfp) {
        return this.authService.signup(signUpDto, pfp)
    }

    @Post('/exit')
    exit(@Res({passthrough: true}) res: Response) {
        res.clearCookie('auth_token')
    }

}
