import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";
import { registrationDto } from './dto/registration.dto';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user._id.toString(), role: user.role }
    return {
        token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(userDto: loginDto) {
    const user = await this.usersService.findByEmail(userDto.email)
    const passwordEquals = await bcrypt.compare(userDto.password, user.password)
    
    if (user && passwordEquals) {
      return user
    }
    
    throw new UnauthorizedException({meassage: "Wrong email or password"})
  }

  async registration(userDto: registrationDto) {
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    try {
      const user = await this.usersService.create({...userDto, password: hashPassword})
      return this.generateToken(user)
    } catch (e) {
      throw e
    }
  }

  async login(userDto: loginDto) {
    const user = await this.validateUser(userDto)
    return this.generateToken(user)
  }
}
