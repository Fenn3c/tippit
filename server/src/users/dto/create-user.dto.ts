export class CreateUserDto {
    phone: string
    name: string
    surname: string
    position?: string
    password: string;
    passwordConfirm: string;
}