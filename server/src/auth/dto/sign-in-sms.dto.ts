import {
    IsNotEmpty, IsString,
} from 'class-validator'

export class SignInAndSendCodeDto {

    @IsString()
    @IsNotEmpty()
    phone: string

    @IsString()
    @IsNotEmpty()
    password: string

}
