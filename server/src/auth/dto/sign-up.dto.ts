import {
    IsNotEmpty, IsString, IsEmail,
    MinLength, MaxLength, IsStrongPassword, Equals, Matches, isPhoneNumber, IsPhoneNumber, IS_PHONE_NUMBER
} from 'class-validator'

export class SignUpDto {

    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('RU')
    phone: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    surname: string

    @IsString()
    position?: string

    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsString()
    passwordConfirm: string;

    @IsString()
    @IsNotEmpty()
    phoneVerificationId: string

    @IsString()
    @IsNotEmpty()
    phoneVerify: string
}