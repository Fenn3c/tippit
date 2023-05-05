import {
    IsNotEmpty, IsPhoneNumber, IsString,
} from 'class-validator'

export class VerifyPhoneDto {
    @IsString()
    @IsNotEmpty()
    verificationId: string

    @IsString()
    @IsNotEmpty()
    phoneVerify: string
}
