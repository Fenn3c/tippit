import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignInAndSendCodeDto } from './dto/sign-in-sms.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('/signin-sms')
    signinSms(@Body() signInAndSendCodeDto: SignInAndSendCodeDto) {
        return this.authService.signinAndSendCode(signInAndSendCodeDto)
    }

    @Post('/signin')
    signin(@Body() signInDto: SignInDto) {
        return this.authService.signin(signInDto)
    }

    @Post('/signup')
    @UseInterceptors(FileInterceptor('pfp'))
    signup(@Body() signUpDto: SignUpDto, @UploadedFile() pfp) {
        return this.authService.signup(signUpDto, pfp)
    }
}
