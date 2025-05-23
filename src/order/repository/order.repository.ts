import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryGetListDateDto } from '../dto/order.query-get-list.dto';
import { Order } from '../entities/order.entity';
@Injectable()
export class OrderRepository {
	constructor(
		@InjectRepository(Order)
		private readonly orderRepository: Repository<Order>,
	) {}

	async findListAndCount(
		query: QueryGetListDateDto,
	): Promise<[Order[], number]> {
		const [items, totalItems] = await this.orderRepository.findAndCount({
			skip: query.skip,
			take: query.pageSize,
		});

		return [items, totalItems];
	}

	async findById(id: number): Promise<Order | null> {
		return this.orderRepository.findOneBy({ id });
	}

	create(orderData: Partial<Order>): Order {
		return this.orderRepository.create(orderData);
	}

	async save(entity: Order): Promise<Order> {
		return this.orderRepository.save(entity);
	}

	async update(id: number, updateData: Partial<Order>): Promise<void> {
		await this.orderRepository.update(id, updateData);
	}

	async delete(id: number): Promise<void> {
		await this.orderRepository.delete(id);
	}
}
