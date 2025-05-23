import { Injectable } from '@nestjs/common';

import { DataListSuccessDto } from 'src/common/dto/response.dto';
import { CreateOrderDto } from '../dto/order.create.dto';
import { QueryGetListDateDto } from '../dto/order.query-get-list.dto';
import { Order } from '../entities/order.entity';
import { OrderRepository } from '../repository/order.repository';

@Injectable()
export class OrderService {
	constructor(private readonly orderRepository: OrderRepository) {}

	async create(payload: CreateOrderDto) {
		const { deadline } = payload;

		const newOrder = this.orderRepository.create({
			deadline,
		});
		const savedOrder = await this.orderRepository.save(newOrder);
		return savedOrder;
	}

	async getList(
		query: QueryGetListDateDto,
	): Promise<DataListSuccessDto<Order>> {
		const [orders, totalItems] =
			await this.orderRepository.findListAndCount(query);

		return new DataListSuccessDto<Order>(orders, {
			totalItems,
			pageSize: query.pageSize,
			currentPage: query.page,
		});
	}
}
