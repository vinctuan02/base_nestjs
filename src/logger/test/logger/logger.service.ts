import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class MyLogger implements LoggerService {
	private logger: Logger;
	private logtail: Logtail;

	constructor() {
		const SOURCE_TOKEN = '';
		const INGESTING_HOST = '';

		this.logtail = new Logtail(SOURCE_TOKEN, {
			endpoint: `https://${INGESTING_HOST}`,
		});

		this.logger = createLogger({
			level: 'debug',
			format: format.combine(
				format.timestamp({ format: 'HH:mm:ss DD/MM/YYYY' }),
				format.errors({ stack: true }),
			),
			transports: [
				new transports.Console({
					format: format.combine(
						format.colorize(),
						format.printf(
							({ timestamp, level, message, stack }) => {
								const strApp = '[Nest]';
								const logMessage = stack || message;
								return `${strApp} - ${timestamp}   ${level}: ${logMessage}`;
							},
						),
					),
				}),

				new LogtailTransport(this.logtail),
			],
			exitOnError: false,
		});
	}

	log(message: string) {
		this.logger.info(message);
	}

	error(message: string, trace?: string) {
		this.logger.error(message, trace ? { stack: trace } : undefined);
	}

	warn(message: string) {
		this.logger.warn(message);
	}

	debug(message: string) {
		this.logger.debug(message);
	}

	verbose(message: string) {
		this.logger.verbose(message);
	}

	// Gọi khi muốn chắc chắn gửi hết log lên BetterStack (ví dụ khi app shutdown)
	async flush() {
		await this.logtail.flush();
	}
}
