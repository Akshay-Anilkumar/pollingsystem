import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      const { password, ...result } = user as any;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(email: string, password: string, role: string = 'USER') {
    const hashed = await bcrypt.hash(password, 10);
    return this.usersService.create({ email, password: hashed, role: role as UserRole });
  }
}