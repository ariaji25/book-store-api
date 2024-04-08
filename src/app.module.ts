import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookService } from './book/book.service';
import { BookController } from './book/book.controller';
import { Book } from './book/book.entity';
import { UserService } from './user/user.service';
import { User } from './user/user.entity';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { typeOrmModuleOption } from './_config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { BalanceService } from './balance/balance.service';
import { BalanceHistory } from './balance/balance_history.entity';
import { BalanceController } from './balance/balance.controller';
import { JwtAuthGuard } from './_guard/jwt_auth.guard';
import { CartService } from './cart/cart.service';
import { Cart } from './cart/cart.entity';
import { CartController } from './cart/cart.controller';
import { OrderService } from './order/order.service';
import { OrderHistory } from './order/order_history.entity';
import { OrderController } from './order/order.controller';

@Module({
  imports: [
    JwtModule.register(jwtConstants),
    TypeOrmModule.forRoot(typeOrmModuleOption),
    TypeOrmModule.forFeature([Book, User, BalanceHistory, Cart, OrderHistory]),
  ],
  controllers: [
    AppController,
    BookController,
    AuthController,
    BalanceController,
    CartController,
    OrderController

  ],
  providers: [
    AppService,
    BookService,
    UserService,
    AuthService,
    BalanceService,
    JwtAuthGuard,
    CartService,
    OrderService,
  ],
})
export class AppModule {}
