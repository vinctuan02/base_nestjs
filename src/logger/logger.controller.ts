import { Body, Controller, Get } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { QueryGetListLogDto } from "./dto/logger.get-list.dto";
import { DataListSuccessDto, ResponseSuccessDto } from "src/common/dto/response.dto";
import { Logger } from "./entities/logger.entity";

@Controller()
export class LoggerController {
    constructor(private readonly loggerService: LoggerService) { }

    @Get('logger')
    async getList(
        @Body() query: QueryGetListLogDto
    ): Promise<ResponseSuccessDto<DataListSuccessDto<Logger>>> {
        const data = await this.loggerService.getList(query)
        return new ResponseSuccessDto({ data });
    }
}