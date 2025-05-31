// import { NextFunction, Request, Response } from 'express';
// import {
// 	EXCLUDE_API,
// 	NOT_SAVE_RES,
// 	NOT_SAVE_VALUE,
// } from './constants/exclude.constant';
// import { CreateLogDto } from './dtos/create.dto';
// import { LogService } from './services/log.main.service';
// import { removeObjectValue } from './utils/remove-body.utils';

// export function LogMiddleware(logService: LogService) {
// 	return (req: Request, res: Response, next: NextFunction) => {
// 		const { method, originalUrl, baseUrl } = req;

// 		const isExclude = EXCLUDE_API.some(
// 			(item) =>
// 				item.method === method &&
// 				(typeof item.url === 'string'
// 					? item.url === originalUrl
// 					: item.url.test(baseUrl)),
// 		);

// 		if (!isExclude) {
// 			const body = removeObjectValue(req.body, NOT_SAVE_VALUE);

// 			// Store response body before sending
// 			const originalSend = res.send;
// 			let responseBody: any;

// 			res.send = (body): Response => {
// 				responseBody = body;
// 				return originalSend.call(res, body);
// 			};

// 			res.on('close', () => {
// 				try {
// 					const { statusCode } = res;
// 					let response = responseBody;

// 					if (originalUrl === '/config' && method === 'GET') {
// 						response = removeObjectValue(
// 							responseBody.data,
// 							NOT_SAVE_VALUE,
// 						);
// 					} else if (
// 						NOT_SAVE_RES.some((item) => originalUrl.includes(item))
// 					) {
// 						response = '';
// 					}

// 					const logPayload: CreateLogDto = {
// 						action: method,
// 						originalUrl: originalUrl,
// 						content: JSON.stringify(body),
// 						note: 'Log from middleware',
// 						success: statusCode >= 200 && statusCode < 400,
// 						statusCode,
// 						response,
// 					};

// 					// Temporary only save error logs
// 					// if (!logPayload.success || method !== 'GET') {
// 					// Use Promise.resolve to handle the async operation without blocking
// 					Promise.resolve(logService.create(logPayload, req)).catch(
// 						(error) => {
// 							console.error('Error in log middleware:', error);
// 						},
// 					);
// 					// }
// 				} catch (error) {
// 					console.error('Error in log middleware:', error);
// 				}
// 			});
// 		}

// 		next();
// 	};
// }

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LogService } from './services/log.main.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
	constructor(private readonly logService: LogService) {}

	use(req: Request, res: Response, next: NextFunction) {
		// const start = Date.now();
		// const { method, originalUrl } = req;

		// let responseBody: any;
		const originalSend = res.send.bind(res);

		res.send = (body: any) => {
			// responseBody = body;
			res.locals.responseBody = body;
			return originalSend(body);
		};

		res.on('finish', () => {
			// const duration = Date.now() - start;
			// const statusCode = res.statusCode;

			// const logPayload: LogPayload = {
			// 	action: method,
			// 	originalUrl,
			// 	content: req.body,
			// 	success: statusCode >= 200 && statusCode < 400,
			// 	statusCode,
			// 	response: responseBody,
			// 	duration,
			// 	timestamp: new Date().toISOString(),
			// };

			this.logService.create(req, res).catch(console.error);
		});

		next();
	}
}
