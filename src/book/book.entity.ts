import { Cart } from "src/cart/cart.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  writer: string

  @Column()
  coverImg: string

  @Column()
  point: number

  @Column({type: "simple-array"})
  tags: string[]

  @OneToMany(() => Cart, cart => cart.book)
  carts: Cart[]
}
