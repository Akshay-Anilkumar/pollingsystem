import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async me(@Request() req: any) {
    const user = await this.usersService.findById(req.user.id);
    if (user) { const { password, ...rest } = user as any; return rest; }
    return { };
  }
}