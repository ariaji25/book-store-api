import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { In, Repository } from 'typeorm';
import { CreateCartDto } from './create_cart.dto';
import { Book } from 'src/book/book.entity';
import { BookService } from 'src/book/book.service';
import { UpdateCartDto } from './update_cart.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class CartService {
  @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>;
  constructor(private readonly bookService: BookService) {}

  async findAll(limit = 10, page = 1, userId: string) {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId }, checkedOut: false },
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        book: true,
      },
    });
    return cartItems;
  }

  async addItem(cartItemDto: CreateCartDto, userId: string) {
    const book = await this.bookService.findOne(cartItemDto.bookId);
    if (!book) {
      throw new BadRequestException('Book not found');
    }

    const cartItem = new Cart();
    cartItem.book = book;
    cartItem.quantity = cartItemDto.quantity;
    cartItem.user = <User>{ id: userId };
    return await this.cartRepository.save(cartItem);
  }

  async updateCartItem(updateCartDto: UpdateCartDto) {
    const cartItem = await this.findOne(updateCartDto.id);

    if (!cartItem) {
      throw new BadRequestException('Cart item not found');
    }

    cartItem.quantity = updateCartDto.quantity;
    cartItem.totalAmount = cartItem.quantity * cartItem.book.point;
    return await this.cartRepository.save(cartItem);
  }

  async findOne(id: string) {
    return await this.cartRepository.findOne({
      where: { id: id },
      relations: {
        book: true,
      },
    });
  }

  async removeCartItem(id: string) {
    const cartItem = await this.findOne(id);
    if (!cartItem) {
      throw new BadRequestException('Cart item not found');
    }
    return await this.cartRepository.remove(cartItem);
  }

  async checkoutedCart(ids: string[]) {
    return this.cartRepository.update({ id: In(ids) }, { checkedOut: true });
  }

  async findByIds(ids: string[]) {
    return this.cartRepository.find({
      where: { id: In(ids) },
      relations: { book: true, user: true },
    });
  }
}
