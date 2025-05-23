import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { StatusResponse } from '../enums/logger.enum';

export class CreateLogDto {

	@IsNotEmpty()
	ip: string;

	@IsNotEmpty()
	method: string;

	@IsOptional()
	originalUrl?: string;

	@IsOptional()
	userAgent?: string;

	@IsNotEmpty()
	status: boolean;

	@IsOptional()
	content?: string;

	@IsOptional()
	response?: string;

	@IsOptional()
	city?: string;

	@IsOptional()
	country?: string;
}

export class CheckRecentLogDto {
	@IsString()
	action: string;

	@IsString()
	originalUrl: string;

	@IsString()
	ip: string;

	@IsNumber()
	statusCode: number;

	@IsString()
	userCreatorId: string;

	@IsString()
	userAgent: string;
}
