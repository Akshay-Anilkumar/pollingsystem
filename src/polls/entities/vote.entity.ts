import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from 'typeorm';
import { User } from '../../users/user.entity';
import { Poll } from './poll.entity';

@Entity()
@Unique(['user', 'poll'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.votes)
  user: User;

  @ManyToOne(() => Poll)
  poll: Poll;

  @Column()
  choice: string;
}