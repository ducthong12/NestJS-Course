import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'accountName is not empty' })
  accountName: string;
  @IsNotEmpty({ message: 'password is not empty' })
  @MinLength(8, { message: 'Password greater than 8 characters' })
  password: string;
}
