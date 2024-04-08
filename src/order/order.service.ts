import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderHistory } from './order_history.entity';
import { Repository } from 'typeorm';
import { BalanceService } from 'src/balance/balance.service';
import { CartService } from 'src/cart/cart.service';
import { BalanceType } from 'src/balance/balance_history.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class OrderService {
  @InjectRepository(OrderHistory)
  private readonly orderRepository: Repository<OrderHistory>;
  constructor(
    private readonly balanceService: BalanceService,
    private readonly cartService: CartService,
  ) {}

  async createOrder(itemIds: string[]) {
    const items = await this.cartService.findByIds(itemIds);
    if (items) {
      const currentBalance = await this.balanceService.findUserBalance(
        items[0].user.id,
      );
      const totalAmount = items.reduce(
        (total, item) => total + item.totalAmount,
        0,
      );
      if (currentBalance.balance < totalAmount) {
        throw new BadRequestException('Insufficient balance');
      }
      var orderHistory = new OrderHistory();
      orderHistory.items = items;
      orderHistory.user = <User>{
        id: items[0].user.id,
      };
      orderHistory = await this.orderRepository.save(orderHistory);
      await this.cartService.checkoutedCart(itemIds);
      await this.balanceService.addBalance(
        items[0].user,
        items[0].totalAmount * -1,
        BalanceType.SUB,
      );
      return orderHistory;
    } else {
      throw new BadRequestException('Cart items not found');
    }
  }

  async getOrderHistory(userId: string) {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect("order.items", "carts")
      .leftJoinAndSelect("carts.book", "book")
      .where('order.user = :userId', { userId: userId })
    const orderHistory = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: {
        items: true,
      },
    });
    return query.getMany();
  }

  async cancelOrder(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
      }
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    order.canceled = true;
    await this.balanceService.addBalance(order.user, order.totalAmount, BalanceType.ADD);
    return this.orderRepository.save(order);
  }
}
