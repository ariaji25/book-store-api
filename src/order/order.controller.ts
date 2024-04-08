import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/_guard/jwt_auth.guard';
import { TokenClaim } from 'src/_decorators/auth';
import { TokenClaimDto } from 'src/auth/token_claim.dto';
import { CreateOrderDto } from './create_order.dto';

@Controller('order')
@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  async checkout(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.createOrder(createOrderDto.items);
    return order;
  }

  @Get('')
  async getOrderHistory(@TokenClaim() tokenClaim: TokenClaimDto) {
    const orderHistory = await this.orderService.getOrderHistory(tokenClaim.id);
    return orderHistory
  }

  @Put('cancel/:id')
  async cancelOrder(@Param('id') id: string) {
    const order = await this.orderService.cancelOrder(id);
    return { message: 'Order canceled' };
  }

}
