import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto.email, dto.password, dto.role);
    const { password, ...result } = user as any;
    return result;
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const validated = await this.authService.validateUser(dto.email, dto.password);
    if (!validated) throw new BadRequestException('Invalid credentials');
    return this.authService.login(validated);
  }
}