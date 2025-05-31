import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { LevelLog } from '../enum/log.enum';

export class CreateLogDto {
	@ApiProperty()
	@IsString()
	action: string;

	@ApiProperty()
	@IsString()
	originalUrl: string;

	@ApiProperty()
	@IsInt()
	statusCode: number;

	@ApiProperty()
	@IsString()
	content: string;

	@ApiProperty()
	@IsString()
	response: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	note: string;

	@ApiProperty()
	@IsBoolean()
	success: boolean;

	@IsNotEmpty()
	level: LevelLog;
}

export class CheckRecentLogDto {
	@ApiProperty()
	@IsString()
	action: string;

	@ApiProperty()
	@IsString()
	originalUrl: string;

	@ApiProperty()
	@IsString()
	ip: string;

	@ApiProperty()
	@IsNumber()
	statusCode: number;

	@ApiProperty()
	@IsString()
	userCreatorId: string;

	@ApiProperty()
	@IsString()
	userAgent: string;

	fifteenMinutesAgo: Date;
}
