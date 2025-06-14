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
    const payload = { 
      email: user.email, 
      id: user._id.toString(), 
      role: user.role,
      name: user.name
    };
    return {
      token: this.jwtService.sign(payload),
      _id: user._id.toString(),
      name: user.name,
      role: user.role,
    }
  }

  private async validateUser(userDto: loginDto) {
    const user = await this.usersService.findOne('email', userDto.email, true)
    const passwordEquals = await bcrypt.compare(userDto.password, user.password)
    
    if (user && passwordEquals) {
      return user
    }
    
    throw new UnauthorizedException({message: "Wrong email or password"})
  }

  async registration(userDto: registrationDto) {
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    try {
      const user = await this.usersService.create({ ...userDto, password: hashPassword });
      const tokenData = await this.generateToken(user);
      return {
        ...tokenData,
        likedTracks: user.likedTracks || [],
        following: user.following || []
      };
    } catch (e) {
      throw e;
    }
  }

  async login(userDto: loginDto) {
    try {
      const user = await this.validateUser(userDto);
      const tokenData = await this.generateToken(user);
      return {
        ...tokenData,
        likedTracks: user.likedTracks || [],
        following: user.following || []
      };
    } catch (e) {
      throw e;
    }
  }

  async validateToken(token: string) {
    try {
      const decoded: any = this.jwtService.verify(token);
      const user = await this.usersService.findOne('id', decoded.id, true);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return {
        _id: user._id.toString(),
        name: user.name,
        role: user.role,
        likedTracks: user.likedTracks || [],
        following: user.following || []
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
