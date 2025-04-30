import { IsString, IsEmail } from 'class-validator';
import { IsSanitized } from '../../utils/decorators/isSanitized.decorator';

export class loginDto {
  @IsEmail()
  @IsSanitized({ message: 'Email contains unsafe content' })
  email: string;

  @IsString()
  @IsSanitized({ message: 'Password contains unsafe content' })
  password: string;
}