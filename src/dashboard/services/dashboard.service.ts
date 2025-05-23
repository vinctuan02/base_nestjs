import { Injectable } from '@nestjs/common';
import { OrderStatisticsService } from 'src/order/services/order.statistics.service';
import { QueryDashboardDto } from '../dto/query-dashboard';
import { IResultDashboard } from '../interfaces/interface.func';
@Injectable()
export class DashboardService {
	constructor(
		private readonly orderStatisticsService: OrderStatisticsService,
	) {}

	async getDashboard(
		query: QueryDashboardDto,
	): Promise<IResultDashboard> {
		const result = await this.orderStatisticsService.groupByDate(query);
		return {
			groupByDate: result,
		};
	}
}
