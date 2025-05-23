import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
	@IsNotEmpty()
	@Type(() => Date)
	@IsDate()
	deadline: Date;
}
