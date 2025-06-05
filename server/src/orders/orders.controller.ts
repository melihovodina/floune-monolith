import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.id;
    return this.ordersService.create(createOrderDto, userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Req() req,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string
  ) {
    const userId = req.user.id;
    return this.ordersService.findAll(userId, dateFrom, dateTo);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/cancel')
  async cancelOrder(@Param('id') orderId: string) {
    return this.ordersService.cancelOrder(orderId);
  }
}
