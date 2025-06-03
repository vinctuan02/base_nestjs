import { Body, Controller, Post } from '@nestjs/common';
import { CreateLogDto } from './dto/logger.create.dto';
import { LoggerService } from './logger.main.service';

@Controller('logger')
export class LoggerController {
	constructor(private readonly loggerService: LoggerService) {}

	// @Get('logger')
	// async getList(
	// 	@Body() query: QueryGetListLogDto,
	// ): Promise<ResponseSuccessDto<DataListSuccessDto<Logger>>> {
	// 	const data = await this.loggerService.getList(query);
	// 	return new ResponseSuccessDto({ data });
	// }

	@Post()
	async createLog(@Body() data: CreateLogDto) {
		await this.loggerService.create(data);
	}
}
