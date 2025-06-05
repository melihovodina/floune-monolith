import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './entities/order.entity';
import { UsersService } from '../users/users.service';
import { ConcertsService } from '../concerts/concerts.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(forwardRef(() => ConcertsService)) private concertsService: ConcertsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    await this.concertsService.changeTicketsQuantity(
      createOrderDto.concertId,
      -createOrderDto.ticketsQuantity
    );

    const createdOrder = new this.orderModel({
      ...createOrderDto,
      userId,
    });
    const savedOrder = await createdOrder.save();
    await this.usersService.toggleOrderInUser(userId, savedOrder._id.toString(), true);
    return savedOrder;
  }

  async findAll(userId: string, dateFrom?: string, dateTo?: string) {
    const filter: any = { userId: new Types.ObjectId(userId) };
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }
    const orders = await this.orderModel.find(filter).lean();
    return orders;
  }
  
  async cancelOrder(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new BadRequestException(`Order with id ${orderId} not found`);
    }
    if (order.cancelled) {
      throw new BadRequestException('Order is already cancelled');
    }

    order.cancelled = true;
    await order.save();

    await this.concertsService.changeTicketsQuantity(
      order.concertId.toString(),
      order.ticketsQuantity
    );

    return order;
  }
}
