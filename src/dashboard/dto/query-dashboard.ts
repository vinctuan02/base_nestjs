import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { TypeGroupDate } from 'src/helper/enum/date.enum';
import { DashboardEnum } from '../constants/dashboard.enum';
import { DateField } from '../enum/date-filed.enum';

export class QueryDashboardDto extends BaseQueryDto {
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	startDate?: Date;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	endDate?: Date;

	@IsEnum(DateField)
	@IsOptional()
	dateField?: DateField = DateField.DEADLINE;

	@IsOptional()
	@IsString()
	timezone?: string = DashboardEnum.DEFAULT_TIMEZONE;

	@IsEnum(TypeGroupDate)
	@IsOptional()
	typeGroupDate?: TypeGroupDate = TypeGroupDate.DAY;
}
