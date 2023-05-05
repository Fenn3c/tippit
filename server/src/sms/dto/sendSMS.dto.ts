import {
    IsNotEmpty, IsPhoneNumber, IsString,
} from 'class-validator'

export class SendSmsDto {
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('RU')
    phone: string
}
