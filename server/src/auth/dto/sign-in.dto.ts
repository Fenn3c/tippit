import {
    IsNotEmpty, IsString,
} from 'class-validator'

export class SignInDto {

    @IsString()
    @IsNotEmpty()
    phone: string

    @IsString()
    @IsNotEmpty()
    password: string


    @IsString()
    @IsNotEmpty()
    phoneVerificationId: string

    @IsString()
    @IsNotEmpty()
    phoneVerify: string
}
