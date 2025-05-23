import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(private readonly loggerService: LoggerService) {}

	// use(req: Request, res: Response, next: NextFunction) {
	// 	const { method, originalUrl } = req;

	// 	let userId: string | undefined = undefined;
	// 	let userEmail: string | undefined = undefined;
	// 	let userAgent: string | undefined = undefined;
	// 	let clientIp: string | undefined = undefined;
	// 	let clientCountry: string | undefined = undefined;
	// 	let clientCity: string | undefined = undefined;

	// 	res.on('close', () => {

	// 		userAgent = this.getHeadersProp(req, 'user-agent');
	// 		clientIp =
	// 			this.getHeadersProp(req, 'client-ip') ??
	// 			getClientIp(req) ??
	// 			req.ip;

	// 		const geo = lookup(clientIp);
	// 		if (geo) {
	// 			clientCountry = geo?.country;
	// 			clientCity = geo?.city;
	// 		}

	// 		const { statusCode } = res;

	// 		// const dataToken: AccessToken | null = await this.jwtService
	// 		// 	.getTokenPayload(req)
	// 		// 	.catch(() => null);
	// 		// if (dataToken) {
	// 		// 	userId = dataToken.id;
	// 		// 	userEmail = dataToken.sub;
	// 		// }

	// 		this.loggerService
	// 			.create({
	// 				ip: clientIp,
	// 				method,
	// 				originalUrl,
	// 				userAgent,
	// 				status: statusCode >= 200 && statusCode < 400,
	// 				city: clientCity,
	// 				country: clientCity
	// 			})
	// 			.catch(console.error);
	// 	});

	// 	next();
	// }

	// private getHeadersProp(req: Request, key: string) {
	// 	return req.headers[key] as string;
	// }

	use(req: Request, res: Response, next: NextFunction) {
		const chunks: any[] = [];

		const originalSend = res.send.bind(res);
		res.send = (body: any): Response => {
			chunks.push(body);
			res.send = originalSend;
			return res.send(body);
		};

		res.on('close', () => {
			const responseBody = chunks.length > 0 ? chunks[0] : undefined;

			this.loggerService
				.logFromRequest(req, res, responseBody)
				.catch(console.error);
		});

		next();
	}
}
