import { Body, Controller, Get, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/sendSMS.dto';
import { VerifySmsDto } from './dto/verifySMS.dto';

@Controller('sms')
export class SmsController {
    constructor(private readonly smsService: SmsService) { }

    @Post('send')
    async sendSMS(@Body() sendSmsDto: SendSmsDto) {
        return await this.smsService.sendSMS(sendSmsDto.phone)
    }

    @Post('verify')
    async verifyCode(@Body() verifySmsDto: VerifySmsDto) {
        return await this.smsService.verifyCode(verifySmsDto)
    }
}
