import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/constants';

export class BaseQueryDto {
	@IsOptional()
	keyword: string;

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Type(() => Number)
	page?: number = DEFAULT_PAGE;

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Type(() => Number)
	pageSize?: number = DEFAULT_PAGE_SIZE;

	get skip(): number {
		return (this.page - 1) * this.pageSize;
	}
}
