import {
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { LevelLog } from '../enums/logger.enum';

export class CreateLogDto {
	@IsOptional()
	@IsString()
	action?: string;

	@IsOptional()
	@IsString()
	ip?: string;

	@IsOptional()
	@IsString()
	country?: string;

	@IsOptional()
	@IsString()
	city?: string;

	@IsOptional()
	@IsString()
	originalUrl?: string;

	@IsOptional()
	@IsNumber()
	statusCode?: number;

	@IsOptional()
	@IsString()
	content?: string;

	@IsOptional()
	response?: any;

	@IsOptional()
	@IsString()
	email?: string;

	@IsOptional()
	@IsString()
	userCreatorId?: string;

	@IsOptional()
	@IsString()
	message?: string;

	@IsOptional()
	@IsBoolean()
	success?: boolean;

	@IsOptional()
	@IsString()
	userAgent?: string;

	@IsOptional()
	@IsEnum(LevelLog)
	level?: LevelLog;

	@IsOptional()
	context?: string;

	@IsOptional()
	trace?: string;
}
