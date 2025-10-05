import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { Vote } from './entities/vote.entity';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, Vote]), UsersModule],
  providers: [PollsService],
  controllers: [PollsController],
})
export class PollsModule {}