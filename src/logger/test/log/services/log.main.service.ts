import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request, Response } from 'express';
import { lookup } from 'geoip-lite';
import { getClientIp } from 'request-ip';
import { EventEmitEnum } from 'src/common/enums/event-emit.enum';
import { AccessToken } from 'src/jwt/jwt.interface';
import { JwtService } from 'src/jwt/jwt.service';
import { GetListLogDto } from '../dtos/get-list.dto';
import { CheckRecentLogDto } from '../dtos/log.create.dto';
import { LevelLog, LogSource } from '../enum/log.enum';
import { ILog } from '../interface/log.interface';
import { BetterStackService } from './providers/log.betterstack.service';
import { LogDbService } from './providers/log.db.service';

@Injectable()
export class LogService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly eventEmitter2: EventEmitter2,
		private readonly logDbService: LogDbService,
		private readonly betterStackService: BetterStackService,
	) {}

	async create(req: Request, res: Response) {
		const { method, originalUrl, body } = req;
		const { statusCode, locals } = res;

		let userId: string | undefined = undefined;
		let userEmail: string | undefined = undefined;
		let userAgent: string | undefined = undefined;
		let clientIp: string | undefined = undefined;
		let clientCountry: string | undefined = undefined;
		let clientCity: string | undefined = undefined;

		if (req) {
			userAgent = this.getHeadersProp(req, 'user-agent');
			clientIp =
				this.getHeadersProp(req, 'client-ip') ??
				getClientIp(req) ??
				req.ip;
			const geo = lookup(clientIp);
			if (geo) {
				clientCountry = geo?.country;
				clientCity = geo?.city;
			}

			const dataToken: AccessToken | null = await this.jwtService
				.getTokenPayload(req)
				.catch(() => null);
			if (dataToken) {
				userId = dataToken.id;
				userEmail = dataToken.sub;
			}
		}

		const { success, level } = this.getLevelAndSuccess(statusCode);

		const isRecentLogExist = await this.isRecentLogExist({
			action: method,
			ip: clientIp ?? '',
			statusCode,
			userCreatorId: userId ?? '',
			userAgent: userAgent ?? '',
			originalUrl,
			fifteenMinutesAgo: new Date(Date.now() - 10 * 60 * 1000),
		});

		if (isRecentLogExist && success) return;

		const logData: ILog = {
			action: method,
			ip: clientIp,
			country: clientCountry,
			city: clientCity,
			originalUrl,
			statusCode,
			content: body,
			response: locals.responseBody,
			email: userEmail,
			userCreatorId: userId,
			note: 'Log from middleware',
			success,
			userAgent: userAgent,
			level,
		};

		await this.logDbService.create(logData);

		await this.betterStackService.create(logData);

		if (success) {
			this.eventEmitter2.emit(EventEmitEnum.ERROR_FROM_SERVER, {
				logData,
			});
		}
	}

	getLevelAndSuccess(code: number): { success: boolean; level: LevelLog } {
		if (code >= 200 && code < 300) {
			return { success: true, level: LevelLog.INFO };
		} else if (code >= 300 && code < 400) {
			return { success: true, level: LevelLog.INFO };
		} else if (code >= 400 && code < 500) {
			return { success: false, level: LevelLog.WARN };
		} else if (code >= 500 && code < 600) {
			return { success: false, level: LevelLog.ERROR };
		}

		return { success: false, level: LevelLog.ERROR };
	}

	async getList(params: GetListLogDto) {
		const { logSource } = params;

		if (logSource === LogSource.DB) {
			await this.logDbService.getList(params);
		}

		if (logSource === LogSource.BETTER_STACK) {
			await this.betterStackService.getList(params);
		}
	}

	private async isRecentLogExist(data: CheckRecentLogDto): Promise<boolean> {
		const logExists = await this.logDbService.findOne(data);

		return !!logExists;
	}

	private getHeadersProp(req: Request, key: string) {
		return req.headers[key] as string;
	}
}
