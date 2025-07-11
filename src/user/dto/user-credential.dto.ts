import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserCredentialDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
