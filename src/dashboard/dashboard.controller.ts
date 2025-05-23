import { Controller, Get, Query } from '@nestjs/common';
import { QueryDashboardDto } from './dto/query-dashboard';
import { DashboardService } from './services/dashboard.service';
import { ResponseSuccessDto } from 'src/common/dto/response.dto';
import { IResultDashboard } from './interfaces/interface.func';

@Controller('dashboard')
export class DashboardController {
	constructor(private readonly dashboardService: DashboardService) {}

	@Get()
	async getDashboard(
		@Query() query: QueryDashboardDto
	): Promise<ResponseSuccessDto<IResultDashboard>> {
		const result = await this.dashboardService.getDashboard(query);
		return new ResponseSuccessDto({
			data: result,
		});
	}
}
