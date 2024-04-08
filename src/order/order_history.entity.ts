import { Cart } from 'src/cart/cart.entity';
import { User } from 'src/user/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('order_histories')
export class OrderHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @Column()
  totalAmount: number;
  
  @Column({ default: false })
  canceled: boolean;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
  @ManyToOne(() => User, (user) => user.orderHistories)
  user: User;
  
  @OneToMany(() => Cart, (cart) => cart.order)
  items: Cart[];
  
  @BeforeInsert()
  updateTotalAmount() {
    this.totalAmount = 0;
    for (const item of this.items) {
      this.totalAmount += item.totalAmount;
    }
  }
}
