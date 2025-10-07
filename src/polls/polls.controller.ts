import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { PollsService } from './polls.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreatePollDto } from './dto/create-poll.dto';
import { VoteDto } from './dto/vote.dto';
import { UpdatePollDto } from './dto/update-poll.dto';

@UseGuards(JwtAuthGuard)
@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Request() req: any, @Body() dto: CreatePollDto) {
    return this.pollsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.pollsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.pollsService.findOne(Number(id), req.user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdatePollDto, @Request() req: any) {
    return this.pollsService.update(Number(id), req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.pollsService.remove(Number(id), req.user.id);
  }

  @Post(':id/vote')
  vote(@Param('id') id: string, @Body() dto: VoteDto, @Request() req: any) {
    return this.pollsService.vote(Number(id), req.user.id, dto.choice);
  }

  @Get(':id/results')
  results(@Param('id') id: string, @Request() req: any) {
    return this.pollsService.getResults(Number(id), req.user);
  }
}