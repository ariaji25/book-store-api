import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum BalanceType {
  ADD = 'add',
  SUB = 'sub',
}

@Entity('balance_histories')
export class BalanceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  point: number;

  @Column()
  type: string;

  @Column({ default: new Date(), type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
