import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Poll } from './entities/poll.entity';
import { Vote } from './entities/vote.entity';
import { UsersService } from '../users/users.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll) private pollRepo: Repository<Poll>,
    @InjectRepository(Vote) private voteRepo: Repository<Vote>,
    private usersService: UsersService,
  ) {}

  async create(adminId: number, dto: any) {
    const admin = await this.usersService.findById(adminId);
    if (!admin) throw new NotFoundException('Admin not found');

    const poll = this.pollRepo.create({
      title: dto.title,
      options: dto.options,
      isPublic: dto.isPublic,
      createdBy: admin,
      expiresAt: new Date(Date.now() + dto.duration * 60 * 1000),
      isActive: true,
    });

    if (!dto.isPublic && dto.allowedUserIds) {
      poll.allowedUsers = await Promise.all(dto.allowedUserIds.map((id) => this.usersService.findById(id)));
    }

    return this.pollRepo.save(poll);
  }

  async findAll(user: any) {
    const publicPolls = await this.pollRepo.find({ where: { isPublic: true } });
    const privatePolls = await this.pollRepo
      .createQueryBuilder('poll')
      .leftJoinAndSelect('poll.allowedUsers', 'user')
      .where('poll.isPublic = false')
      .andWhere('user.id = :userId', { userId: user.id })
      .getMany();

    return [...publicPolls, ...privatePolls];
  }

  async findOne(id: number, user: any) {
    const poll = await this.pollRepo.findOne({ where: { id }, relations: ['allowedUsers', 'createdBy'] });
    if (!poll) throw new NotFoundException('Poll not found');
    if (!poll.isPublic) {
      const allowed = poll.allowedUsers.some(u => u.id === user.id);
      if (!allowed && user.role !== 'ADMIN') throw new ForbiddenException('Not allowed to view this private poll');
    }
    return poll;
  }

  async update(id: number, adminId: number, dto: any) {
    const poll = await this.pollRepo.findOne({ where: { id }, relations: ['createdBy', 'allowedUsers'] });
    if (!poll) throw new NotFoundException('Poll not found');
    if (poll.createdBy.id !== adminId) throw new ForbiddenException('Not owner');
    if (!poll.isActive) throw new BadRequestException('Cannot edit inactive/expired poll');

    if (dto.title) poll.title = dto.title;
    if (dto.options) poll.options = dto.options;
    if (typeof dto.isPublic === 'boolean') poll.isPublic = dto.isPublic;
    if (dto.allowedUserIds) poll.allowedUsers = await Promise.all(dto.allowedUserIds.map((id) => this.usersService.findById(id)));
    if (dto.duration) poll.expiresAt = new Date(Date.now() + dto.duration * 60 * 1000);

    return this.pollRepo.save(poll);
  }

  async remove(id: number, adminId: number) {
    const poll = await this.pollRepo.findOne({ where: { id }, relations: ['createdBy'] });
    if (!poll) throw new NotFoundException('Poll not found');
    if (poll.createdBy.id !== adminId) throw new ForbiddenException('Not owner');
    await this.voteRepo.delete({ poll: { id } });
    await this.pollRepo.delete(id);
    return { message: 'Poll deleted' };
  }

  async vote(pollId: number, userId: number, choice: string) {
    const poll = await this.pollRepo.findOne({ where: { id: pollId }, relations: ['allowedUsers'] });
    if (!poll) throw new NotFoundException('Poll not found');

    if (!poll.isActive || poll.expiresAt < new Date()) {
      poll.isActive = false;
      await this.pollRepo.save(poll);
      throw new BadRequestException('Poll is not active');
    }

    if (!poll.isPublic) {
      const allowed = poll.allowedUsers.some((u) => u.id === userId);
      if (!allowed) throw new ForbiddenException('Not allowed to vote in this private poll');
    }

    const existing = await this.voteRepo.findOne({ where: { user: { id: userId }, poll: { id: pollId } } as any });
    if (existing) throw new BadRequestException('User already voted in this poll');

    if (!poll.options.includes(choice)) throw new BadRequestException('Invalid choice');

    const vote = this.voteRepo.create({ user: await this.usersService.findById(userId), poll, choice });
    return this.voteRepo.save(vote);
  }

  async getResults(id: number) {
    const poll = await this.pollRepo.findOne({ where: { id } });
    if (!poll) throw new NotFoundException('Poll not found');

    const votes = await this.voteRepo.find({ where: { poll: { id } } as any });
    const tally = poll.options.reduce((acc, opt) => ({ ...acc, [opt]: 0 }), {} as Record<string, number>);
    for (const v of votes) tally[v.choice] = (tally[v.choice] || 0) + 1;
    return { poll: { id: poll.id, title: poll.title, options: poll.options }, tally };
  }

  @Cron('*/1 * * * *')
  async expirePolls() {
    const now = new Date();
    await this.pollRepo.update({ expiresAt: LessThan(now), isActive: true }, { isActive: false });
  }
}