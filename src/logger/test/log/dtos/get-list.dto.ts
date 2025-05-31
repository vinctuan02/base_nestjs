import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { BaseQuery } from 'src/common/dtos/base-query.dto';
import { LogSource } from '../enum/log.enum';

export class GetListLogDto extends BaseQuery {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	action?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@Transform(({ value }) => (value ? value === 'true' : undefined))
	success?: boolean;

	@IsOptional()
	logSource?: LogSource = LogSource.BETTER_STACK;
}
