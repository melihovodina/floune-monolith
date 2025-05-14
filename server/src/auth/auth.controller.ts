import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registrationDto } from './dto/registration.dto';
import { loginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/registration')
  registration(@Body() userDto: registrationDto) {
    return this.authService.registration(userDto)
  }

  @Post('/login')
  login(@Body() userDto: loginDto) {
    return this.authService.login(userDto)
  }

  @Post('/validate')
  async validate(@Body('token') token: string) {
    return this.authService.validateToken(token);
  }
}