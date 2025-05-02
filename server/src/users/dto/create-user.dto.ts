import { IsString, IsEmail, IsOptional, IsEnum, Length } from 'class-validator';
import { IsSanitized } from '../../utils/decorators/isSanitized.decorator';

export class CreateUserDto {
  @IsString()
  @IsSanitized({ message: 'Name contains unsafe content' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @IsEmail()
  @IsSanitized({ message: 'Email contains unsafe content' })
  @Length(1, 100, { message: 'Email must be between 1 and 100 characters' })
  email: string;

  @IsString()
  @IsSanitized({ message: 'Password contains unsafe content' })
  @Length(8, 100, { message: 'Password must be between 8 and 100 characters' })
  password: string;

  @IsEnum(['user', 'artist'])
  @IsOptional()
  role?: string;
}