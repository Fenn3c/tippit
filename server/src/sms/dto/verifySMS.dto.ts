import {
    IsNotEmpty, IsPhoneNumber, IsString, Length, length,
} from 'class-validator'

export class VerifySmsDto {

    @IsString()
    @IsNotEmpty()
    verificationId: string

    @IsString()
    @IsNotEmpty()
    @Length(5)
    code: string
}
