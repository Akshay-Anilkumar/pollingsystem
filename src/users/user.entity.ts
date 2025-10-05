import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Poll } from '../polls/entities/poll.entity';
import { Vote } from '../polls/entities/vote.entity';

export type UserRole = 'ADMIN' | 'USER';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'USER' })
  role: UserRole;

  @OneToMany(() => Poll, (poll) => poll.createdBy)
  polls: Poll[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}