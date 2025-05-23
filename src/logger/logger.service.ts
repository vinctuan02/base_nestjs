import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { lookup } from 'geoip-lite';
import { getClientIp } from 'request-ip';
import { DataListSuccessDto } from 'src/common/dto/response.dto';
import { JsonService } from 'src/helper/services/json.service';
import { Repository } from 'typeorm';
import { CreateLogDto } from './dto/logger.create.dto';
import { QueryGetListLogDto } from './dto/logger.get-list.dto';
import { Logger } from './entities/logger.entity';

@Injectable()
export class LoggerService {
	constructor(
		@InjectRepository(Logger)
		private readonly loggerRepository: Repository<Logger>,
		private readonly jsonService: JsonService,
	) {}

	async create(data: CreateLogDto): Promise<void> {
		const log = this.loggerRepository.create(data);
		await this.loggerRepository.save(log);
	}

	async logFromRequest(
		req: Request,
		res: Response,
		responseBody: any,
	): Promise<void> {
		const ip = getClientIp(req) ?? req.ip;
		const geo = ip ? lookup(ip) : undefined;
		const userAgent = req.headers['user-agent'];

		const { method, originalUrl, body } = req;
		const { statusCode } = res;

		const dto: CreateLogDto = {
			ip,
			method,
			originalUrl,
			userAgent: typeof userAgent === 'string' ? userAgent : '',
			status: statusCode >= 200 && statusCode < 400,
			city: geo?.city,
			country: geo?.country,
			content: this.jsonService.safeStringify(body, 3000),
			response: this.jsonService.safeStringify(responseBody, 5000),
		};

		const log = this.loggerRepository.create(dto);
		await this.loggerRepository.save(log);
	}

	async getList(
		query: QueryGetListLogDto,
	): Promise<DataListSuccessDto<Logger>> {
		const { page, pageSize, keyword } = query;

		const queryBuilder = this.loggerRepository.createQueryBuilder('logger');

		// if (keyword) {
		// 	queryBuilder.andWhere(
		// 		new Brackets((qb) => {
		// 			qb.where('log.content LIKE :content', {
		// 				content: `%${keyword}%`,
		// 			})
		// 				.orWhere('log.email LIKE :email', {
		// 					email: `%${keyword}%`,
		// 				})
		// 				.orWhere('log.userCreatorId LIKE :userCreatorId', {
		// 					userCreatorId: `%${keyword}%`,
		// 				})
		// 				.orWhere('log.ip LIKE :ip', {
		// 					ip: `%${keyword}%`,
		// 				})
		// 				.orWhere('log.country LIKE :country', {
		// 					country: `%${keyword}%`,
		// 				})
		// 				.orWhere('log.city LIKE :city', {
		// 					city: `%${keyword}%`,
		// 				})
		// 				.orWhere('log.originalUrl LIKE :originalUrl', {
		// 					originalUrl: `%${keyword}%`,
		// 				})
		// 				.orWhere('log.statusCode LIKE :statusCode', {
		// 					statusCode: `%${keyword}%`,
		// 				})
		// 				.orWhere('log.userAgent LIKE :userAgent', {
		// 					userAgent: `%${keyword}%`,
		// 				})
		// 				.orWhere('log.note LIKE :note', {
		// 					note: `%${keyword}%`,
		// 				});
		// 		}),
		// 	);
		// }

		queryBuilder.orderBy('logger.createdAt', 'DESC');

		const [listLoggers, totalItems] = await queryBuilder.getManyAndCount();

		const parsedLoggers = listLoggers.map((log) => {
			try {
				return {
					...log,
					response: log.response
						? this.jsonService.safeParse(log.response)
						: null,
					content: log.content
						? this.jsonService.safeParse(log.content)
						: null,
				};
			} catch {
				return {
					...log,
					response: log.response,
					content: log.content,
				};
			}
		});

		return new DataListSuccessDto<Logger>(parsedLoggers, {
			currentPage: page,
			pageSize,
			totalItems,
		});
	}
}
