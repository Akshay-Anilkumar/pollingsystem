import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Poll } from './src/polls/entities/poll.entity';
import { Vote } from './src/polls/entities/vote.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'polling',
  entities: [User, Poll, Vote],
  synchronize: true,
});