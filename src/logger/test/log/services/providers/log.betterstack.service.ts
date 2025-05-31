// import { Logtail } from '@logtail/node';
// import { LogtailTransport } from '@logtail/winston';
// import { Injectable } from '@nestjs/common';
// import { createLogger, format, Logger, transports } from 'winston';
// import 'winston-daily-rotate-file';

// @Injectable()
// export class BetterStackService {
// 	private logger: Logger;
// 	private logtail: Logtail;

// 	constructor() {
// 		const SOURCE_TOKEN = '';
// 		const INGESTING_HOST = '';

// 		this.logtail = new Logtail(SOURCE_TOKEN, {
// 			endpoint: `https://${INGESTING_HOST}`,
// 		});

// 		this.logger = createLogger({
// 			level: 'debug',
// 			format: format.combine(
// 				format.timestamp({ format: 'HH:mm:ss DD/MM/YYYY' }),
// 				format.errors({ stack: true }),
// 			),
// 			transports: [
// 				new transports.Console({
// 					format: format.combine(
// 						format.colorize(),
// 						format.printf(
// 							({ timestamp, level, message, stack }) => {
// 								const strApp = '[Nest]';
// 								const logMessage = stack || message;
// 								return `${strApp} - ${timestamp}   ${level}: ${logMessage}`;
// 							},
// 						),
// 					),
// 				}),

// 				new LogtailTransport(this.logtail),
// 			],
// 			exitOnError: false,
// 		});
// 	}

// 	async flush() {
// 		await this.logtail.flush();
// 	}
// }
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GetListLogDto } from 'src/log/dtos/get-list.dto';
import {
	createLogger,
	format,
	transports,
	Logger as WinstonLogger,
} from 'winston';
import { LevelLog } from '../../enum/log.enum';
import { ILog } from '../../interface/log.interface';

@Injectable()
export class BetterStackService {
	private readonly logger: WinstonLogger;
	private readonly logtail: Logtail;
	private readonly apiUrl = 'https://api.betterstack.com/v1/logs/search';

	constructor() {
		const SOURCE_TOKEN = process.env.SOURCE_TOKEN;
		const INGESTING_HOST =
			process.env.INGESTING_HOST || 'in.logs.betterstack.com';

		this.logtail = new Logtail(SOURCE_TOKEN!, {
			endpoint: `https://${INGESTING_HOST}`,
		});

		this.logger = createLogger({
			level: 'info',
			format: format.combine(
				format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				format.errors({ stack: true }),
				format.printf(({ timestamp, level, message, stack }) => {
					return `[Nest] - ${timestamp}  ${level.toUpperCase()}: ${stack || message}`;
				}),
			),
			transports: [
				new transports.Console({
					format: format.combine(format.colorize()),
				}),
				new LogtailTransport(this.logtail),
			],
		});
	}

	info(data: ILog) {
		this.logger.info(data);
	}

	error(data: ILog) {
		this.logger.error(data);
	}

	warn(data: ILog) {
		this.logger.warn(data);
	}

	debug(data: ILog) {
		this.logger.debug(data);
	}

	async flush() {
		await this.logtail.flush();
	}

	async create(data: ILog) {
		const { level } = data;

		switch (level) {
			case LevelLog.INFO:
				this.info(data);
				break;

			case LevelLog.ERROR:
				this.error(data);
				break;

			case LevelLog.WARN:
				this.warn(data);
				break;

			case LevelLog.DEBUG:
				this.debug(data);
				break;

			default:
				break;
		}
	}

	async getList(params: GetListLogDto) {
		try {
			const response = await axios.get(
				'https://logs.betterstack.com/api/v1/logs/search',
				{
					params: {
						query: 'error',
						limit: 50,
					},
					headers: {
						Authorization: `Bearer ${'eqH7X1ntdFQiWbw73KhM7ANz'}`,
						'Content-Type': 'application/json',
					},
				},
			);

			// Trả về kết quả log
			return response.data;
		} catch (error) {
			console.error('Error fetching logs from BetterStack:', error);
			throw new Error('Error fetching logs');
		}
	}
}
