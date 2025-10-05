import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('simple-array')
  options: string[];

  @Column({ default: true })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.polls)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  allowedUsers: User[];
}