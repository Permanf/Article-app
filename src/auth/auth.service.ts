import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
  const user = await this.usersService.findOneByEmail(email);
  if (user && bcrypt.compareSync(pass, user.password)) {
    return {
      id: user.id,
      email: user.email
    };
  }
  return null;
}

  async login(user: any) {
    const user_loggin = await this.usersService.findOneByEmail(user.email);
    const payload = { 
      sub: user_loggin.id,
      email: user_loggin.email 
    };    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
    return this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
  }
}