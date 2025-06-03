import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { CreateLogDto } from './dto/logger.create.dto';
import { LevelLog } from './enums/logger.enum';

@Injectable()
export class LoggerService implements NestLoggerService {
	private logger: winston.Logger;

	constructor(private readonly configService: ConfigService) {
		const DIR_LOG = this.configService.get<string>('DIR_LOG');
		this.logger = winston.createLogger({
			// level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

			format: winston.format.combine(
				winston.format.timestamp({
					format: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
				}),
				winston.format.metadata({
					fillExcept: ['message', 'level', 'timestamp'],
				}),
				winston.format.json(),
			),
			defaultMeta: {
				service: 'nestjs-app',
				environment: process.env.NODE_ENV || 'development',
			},
			transports: [
				// new winston.transports.Console({
				// 	format: winston.format.combine(winston.format.json()),
				// }),

				new winston.transports.File({ filename: DIR_LOG }),
			],
		});
	}

	log(data: CreateLogDto) {
		this.logger.info(data.message, { data });
	}

	error(data: CreateLogDto) {
		this.logger.error(data.message, { data });
	}

	warn(data: CreateLogDto) {
		this.logger.warn(data.message, { data });
	}

	debug?(data: CreateLogDto) {
		this.logger.debug?.(data.message, { data });
	}

	verbose?(data: CreateLogDto) {
		this.logger.verbose?.(data.message, { data });
	}

	create(data: CreateLogDto) {
		const { level } = data;

		switch (level) {
			case LevelLog.INFO:
				this.log(data);
				break;

			case LevelLog.WARN:
				this.warn(data);
				break;

			case LevelLog.ERROR:
				this.error(data);
				break;

			case LevelLog.DEBUG:
				this.debug(data);
				break;

			case LevelLog.VERBOSE:
				this.verbose(data);
				break;

			default:
				this.log(data);
				break;
		}
	}
}
