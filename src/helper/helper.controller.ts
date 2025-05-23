import { Controller, Get } from '@nestjs/common';
import { ResponseSuccessDto } from 'src/common/dto/response.dto';
import { DateService } from './services/date.service';

@Controller('helper')
export class HelperController {
	constructor(private readonly dateService: DateService) { }

	@Get('date/current-times')
	async getCurrentTimes(): Promise<ResponseSuccessDto<any>> {
		const data = await this.dateService.getCurrentTimes();
		return new ResponseSuccessDto({ data });
	}
}
