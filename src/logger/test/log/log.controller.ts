import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetListLogDto } from './dtos/get-list.dto';
import { LogService } from './services/log.main.service';

@ApiBearerAuth()
@ApiTags('Log')
@Controller('log')
export class LogController {
	constructor(private readonly logService: LogService) {}

	@ApiOperation({ summary: 'Get list logs' })
	@Get()
	getList(@Query() params: GetListLogDto) {
		return this.logService.getList(params);
	}
}
