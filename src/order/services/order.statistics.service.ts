import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateService } from 'src/helper/services/date.service';
import { Repository } from 'typeorm';
import { QueryDashboardDto } from '../../dashboard/dto/query-dashboard';
import { Order } from '../entities/order.entity';
import {
	IOrderGroupByDate,
	IOrderRawDataGroupByDate,
} from '../interfaces/order.interface';
import { IGetDataGroupByDate } from '../interfaces/order.interface-func';

@Injectable()
export class OrderStatisticsService {
	constructor(
		@InjectRepository(Order)
		private readonly orderRepository: Repository<Order>,
		private readonly dateService: DateService,
	) {}

	async groupByDate(query: QueryDashboardDto): Promise<IOrderGroupByDate[]> {
		const { startDate, endDate, dateField, typeGroupDate, timezone } =
			query;

		const { groupFormat, listDate } =
			this.dateService.getListDateAndGroupFormat(
				startDate,
				endDate,
				typeGroupDate,
			);

		const dataGroupDate = await this.getDataGroupByDate({
			startDate,
			endDate,
			dateField,
			groupFormat,
			timezone,
		});

		const result = listDate.map((date) => {
			return {
				date,
				count: dataGroupDate.get(date) || 0,
			};
		});

		return result;
	}

	async getDataGroupByDate(
		data: IGetDataGroupByDate,
	): Promise<Map<string, number>> {
		const resultMap = new Map<string, number>();

		const { startDate, endDate, dateField, groupFormat, timezone } = data;

		const queryBuilder = this.orderRepository
			.createQueryBuilder('order')
			.select(
				`to_char(order.${dateField} AT TIME ZONE :tz, '${groupFormat}')`,
				'date',
			)
			.addSelect('COUNT(order.id)::int', 'count')
			.groupBy('date')
			.orderBy('date', 'ASC')
			.setParameter('tz', timezone);

		if (startDate && endDate) {
			queryBuilder.andWhere(
				`order.${dateField} BETWEEN :startDate AND :endDate`,
				{
					startDate,
					endDate,
				},
			);
		}

		const rawData =
			await queryBuilder.getRawMany<IOrderRawDataGroupByDate>();

		rawData.forEach((item) => {
			resultMap.set(item.date, item.count);
		});

		return resultMap;
	}
}
