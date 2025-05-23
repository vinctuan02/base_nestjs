import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
	DataListSuccessDto,
	ResponseSuccessDto,
} from 'src/common/dto/response.dto';
import { OrderService } from 'src/order/services/order.service';
import { CreateOrderDto } from './dto/order.create.dto';
import { QueryGetListDateDto } from './dto/order.query-get-list.dto';
import { Order } from './entities/order.entity';

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post()
	async create(
		@Body() payload: CreateOrderDto,
	): Promise<ResponseSuccessDto<Order>> {
		const data = await this.orderService.create(payload);
		return new ResponseSuccessDto({ data });
	}

	@Get()
	async getList(
		@Query() query: QueryGetListDateDto,
	): Promise<ResponseSuccessDto<DataListSuccessDto<Order>>> {
		const data = await this.orderService.getList(query);
		return new ResponseSuccessDto({ data });
	}
}
