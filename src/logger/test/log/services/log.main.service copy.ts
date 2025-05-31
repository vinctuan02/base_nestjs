// import { Injectable, Logger } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Request } from 'express';
// import { lookup } from 'geoip-lite';
// import { getClientIp } from 'request-ip';
// import { ListResponse } from 'src/common/dtos/response.dto';
// import { EventEmitEnum } from 'src/common/enums/event-emit.enum';
// import { AccessToken } from 'src/jwt/jwt.interface';
// import { JwtService } from 'src/jwt/jwt.service';
// import { Brackets, MoreThan, Repository } from 'typeorm';
// import { GetListLogDto } from '../dtos/get-list.dto';
// import { CheckRecentLogDto, CreateLogDto } from '../dtos/log.create.dto';
// import { LogEntity } from '../entities/log.entity';

// @Injectable()
// export class LogService {
// 	private readonly logger = new Logger(LogService.name);

// 	constructor(
// 		@InjectRepository(LogEntity)
// 		private readonly logRepository: Repository<LogEntity>,
// 		private readonly jwtService: JwtService,
// 		private readonly eventEmitter2: EventEmitter2,
// 	) {}

// 	async create(payload: CreateLogDto, req?: Request) {
// 		let userId: string | undefined = undefined;
// 		let userEmail: string | undefined = undefined;
// 		let userAgent: string | undefined = undefined;
// 		let clientIp: string | undefined = undefined;
// 		let clientCountry: string | undefined = undefined;
// 		let clientCity: string | undefined = undefined;

// 		if (req) {
// 			userAgent = this.getHeadersProp(req, 'user-agent');
// 			clientIp =
// 				this.getHeadersProp(req, 'client-ip') ??
// 				getClientIp(req) ??
// 				req.ip;

// 			const geo = lookup(clientIp);
// 			if (geo) {
// 				clientCountry = geo?.country;
// 				clientCity = geo?.city;
// 			}

// 			const dataToken: AccessToken | null = await this.jwtService
// 				.getTokenPayload(req)
// 				.catch(() => null);
// 			if (dataToken) {
// 				userId = dataToken.id;
// 				userEmail = dataToken.sub;
// 			}
// 		}

// 		const isRecentLogExist = await this.isRecentLogExist({
// 			...payload,
// 			ip: clientIp ?? '',
// 			userAgent: userAgent ?? '',
// 			userCreatorId: userId ?? '',
// 		});
// 		if (isRecentLogExist && payload.success) return;

// 		const logData: Partial<LogEntity> = {
// 			...payload,
// 			ip: clientIp,
// 			country: clientCountry,
// 			city: clientCity,
// 			userAgent: userAgent,
// 			userCreatorId: userId,
// 			email: userEmail,
// 		};

// 		const newLog = this.logRepository.create(logData);
// 		if (!newLog.success || newLog.action !== 'GET') {
// 			await this.logRepository.save(newLog);

// 			this.logger.error(newLog);
// 		}

// 		if (!newLog.success) {
// 			this.eventEmitter2.emit(EventEmitEnum.ERROR_FROM_SERVER, {
// 				newLog,
// 			});
// 		}
// 	}

// 	async getList(params: GetListLogDto): Promise<ListResponse<LogEntity>> {
// 		const {
// 			keyword,
// 			pageSize,
// 			skip,
// 			action,
// 			success,
// 			startDateCreated,
// 			endDateCreated,
// 		} = params;

// 		const queryBuilder = this.logRepository.createQueryBuilder('log');

// 		if (keyword) {
// 			queryBuilder.andWhere(
// 				new Brackets((qb) => {
// 					qb.where('log.content LIKE :content', {
// 						content: `%${keyword}%`,
// 					})
// 						.orWhere('log.email LIKE :email', {
// 							email: `%${keyword}%`,
// 						})
// 						.orWhere('log.userCreatorId LIKE :userCreatorId', {
// 							userCreatorId: `%${keyword}%`,
// 						})
// 						.orWhere('log.ip LIKE :ip', {
// 							ip: `%${keyword}%`,
// 						})
// 						.orWhere('log.country LIKE :country', {
// 							country: `%${keyword}%`,
// 						})
// 						.orWhere('log.city LIKE :city', {
// 							city: `%${keyword}%`,
// 						})
// 						.orWhere('log.originalUrl LIKE :originalUrl', {
// 							originalUrl: `%${keyword}%`,
// 						})
// 						.orWhere('log.statusCode LIKE :statusCode', {
// 							statusCode: `%${keyword}%`,
// 						})
// 						.orWhere('log.userAgent LIKE :userAgent', {
// 							userAgent: `%${keyword}%`,
// 						})
// 						.orWhere('log.note LIKE :note', {
// 							note: `%${keyword}%`,
// 						});
// 				}),
// 			);
// 		}

// 		if (action) {
// 			queryBuilder.andWhere('log.action LIKE :action', {
// 				action: `%${action}%`,
// 			});
// 		}

// 		if (success !== undefined) {
// 			queryBuilder.andWhere('log.success = :success', {
// 				success,
// 			});
// 		}

// 		if (startDateCreated && endDateCreated) {
// 			queryBuilder.andWhere(
// 				`log.dateCreated BETWEEN :startDateCreated AND :endDateCreated`,
// 				{ startDateCreated, endDateCreated },
// 			);
// 		}
// 		queryBuilder
// 			.orderBy('log.dateCreated', 'DESC')
// 			.skip(skip)
// 			.take(pageSize);

// 		const [data, total] = await queryBuilder.getManyAndCount();

// 		return new ListResponse(data, total);
// 	}

// 	private async isRecentLogExist({
// 		action,
// 		ip,
// 		statusCode,
// 		userCreatorId,
// 		userAgent,
// 		originalUrl,
// 	}: CheckRecentLogDto): Promise<boolean> {
// 		// Tính thời gian 10 phút trước
// 		const fifteenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

// 		// Kiểm tra dữ liệu
// 		const logExists = await this.logRepository.findOne({
// 			where: {
// 				originalUrl,
// 				action,
// 				ip,
// 				statusCode,
// 				userCreatorId,
// 				userAgent,
// 				dateCreated: MoreThan(fifteenMinutesAgo),
// 			},
// 		});

// 		return !!logExists;
// 	}

// 	private getHeadersProp(req: Request, key: string) {
// 		return req.headers[key] as string;
// 	}
// }
