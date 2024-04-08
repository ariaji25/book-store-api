import { Body, Controller, DefaultValuePipe, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CartService } from "./cart.service";
import { JwtAuthGuard } from "src/_guard/jwt_auth.guard";
import { TokenClaim } from "src/_decorators/auth";
import { TokenClaimDto } from "src/auth/token_claim.dto";
import { CreateCartDto } from "./create_cart.dto";
import { UpdateCartDto } from "./update_cart.dto";

@Controller("cart")
@ApiTags("Cart")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly cartService: CartService
  ){}

  @Get('')
  async findCart(
    @TokenClaim() tokenClaimDto: TokenClaimDto,
    @Query("page", new DefaultValuePipe(1)) page: number = 1,
    @Query("limit", new DefaultValuePipe(10)) limit: number = 10
  ){
    const carts = await this.cartService.findAll(limit, page, tokenClaimDto.id)
    return carts
  }

  @Post('')
  async addCartItem(
    @TokenClaim() tokenClaimDto: TokenClaimDto,
    @Body() createCartItemDto : CreateCartDto
  ) {
    const cart = await this.cartService.addItem(createCartItemDto, tokenClaimDto.id)
    return cart
  }

  @Put(':id')
  async updateCartItem(
    @Param("id") id: string,
    @Body() updateCartItemDto: UpdateCartDto,
  )  {
    const cart = await this.cartService.updateCartItem(updateCartItemDto)
    return cart
  }

  @Delete(':id')
  async removeCartItem(
    @Param("id") id: string
  ) {
    await this.cartService.removeCartItem(id)
    return true
  }
  
}