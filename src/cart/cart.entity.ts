import { Book } from 'src/book/book.entity';
import { OrderHistory } from 'src/order/order_history.entity';
import { User } from 'src/user/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Book, (book) => book.carts)
  book: Book;

  @ManyToOne(() => User, (user) => user.cartItems)
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column()
  totalAmount: number;

  @Column({ default: false })
  checkedOut: boolean;

  @ManyToOne(() => OrderHistory, (order) => order.items, { nullable: true })
  order: OrderHistory;

  @BeforeInsert()
  async calculateTotalAmount() {
    this.totalAmount = this.quantity * this.book.point;
  }

  @BeforeUpdate()
  async updateTotalAmount() {
    this.totalAmount = this.quantity * this.book.point;
  }
}
