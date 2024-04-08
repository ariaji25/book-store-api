import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { BalanceHistory } from "src/balance/balance_history.entity";
import { Cart } from "src/cart/cart.entity";
import { OrderHistory } from "src/order/order_history.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  email: string

  @Column()
  password: string

  @ManyToOne(() => BalanceHistory, balance_history => balance_history.user)
  balanceHistories: BalanceHistory[]

  @ManyToOne(() => Cart, (cart) => cart.user)
  cartItems: Cart[]

  @ManyToOne(() => OrderHistory, (order) => order.user)
  orderHistories: OrderHistory[]

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
  }
}