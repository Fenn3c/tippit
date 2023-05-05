import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhoneVerification } from './phoneVerifications.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid'
import { VerifySmsDto } from './dto/verifySMS.dto';
import { VerifyPhoneDto } from './dto/verifyPhone.dto';


@Injectable()
export class SmsService {

    constructor(@InjectRepository(PhoneVerification) private phoneVerificationRepository: Repository<PhoneVerification>) { }

    async sendSMS(phone: string) {
        const code = Math.floor(10000 + Math.random() * 90000).toString()
        const phoneVerification = new PhoneVerification()
        phoneVerification.code = await bcrypt.hash(code, 10);
        phoneVerification.generateDate = new Date()
        phoneVerification.phone = phone
        phoneVerification.uuid = v4()
        this.phoneVerificationRepository.save(phoneVerification)
        console.log(`Sent SMS code: ${code} to phone: ${phone}`)
        return {
            'verificationId': phoneVerification.uuid
        }
    }


    async verifyCode(verifySmsDto: VerifySmsDto) {
        const phoneVerification = await this.findVerificationByUuid(verifySmsDto.verificationId)
        if (phoneVerification) {
            if (await bcrypt.compare(verifySmsDto.code, phoneVerification.code) && !phoneVerification.accessDate) {
                const accessCode = v4()
                const hashAccessCode = await bcrypt.hash(accessCode, 10)
                this.phoneVerificationRepository.save({ ...phoneVerification, accessCode: hashAccessCode })
                return {
                    'verificationId': verifySmsDto.verificationId,
                    'accessCode': accessCode
                }
            }
        }

        throw new UnauthorizedException('Не удалось подтвердить номер')
    }

    async verifyPhone(verificationId: string, accessCode: string): Promise<Boolean> {
        const phoneVerification = await this.findVerificationByUuid(verificationId)
        if (phoneVerification) {
            if (await bcrypt.compare(accessCode, phoneVerification.accessCode) && !phoneVerification.accessDate) {
                this.phoneVerificationRepository.save({ ...phoneVerification, accessDate: new Date() })
                return true
            }
        }
        throw new UnauthorizedException('Не удалось подтвердить номер')
    }


    async findVerificationByUuid(uuid: string) {
        return await this.phoneVerificationRepository.findOneBy({ uuid })
    }
}
