import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/sendSMS.dto';
import { VerifySmsDto } from './dto/verifySMS.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sms')
export class SmsController {
    constructor(private readonly smsService: SmsService) { }

    @Post('send')
    async sendSMS(@Body() sendSmsDto: SendSmsDto) {
        return await this.smsService.sendSMS(sendSmsDto.phone)
    }

    @Post('send/me')
    @UseGuards(JwtAuthGuard)
    async sendMeSMS(@Req() req) {
        return await this.smsService.sendMeSMS(req.user.id)
    }

    @Post('verify')
    async verifyCode(@Body() verifySmsDto: VerifySmsDto) {
        return await this.smsService.verifyCode(verifySmsDto)
    }
}
