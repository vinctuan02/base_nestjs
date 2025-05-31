import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListResponse } from 'src/common/dtos/response.dto';
import { Brackets, MoreThan, Repository } from 'typeorm';
import { GetListLogDto } from '../../dtos/get-list.dto';
import { CheckRecentLogDto } from '../../dtos/log.create.dto';
import { LogEntity } from '../../entities/log.entity';
import { ILog } from '../../interface/log.interface';

@Injectable()
export class LogDbService {
	constructor(
		@InjectRepository(LogEntity)
		private readonly logRepository: Repository<LogEntity>,
	) {}

	async create(data: ILog) {
		const newLog = this.logRepository.create(data);
		await this.logRepository.save(newLog);
	}

	async getList(params: GetListLogDto): Promise<ListResponse<LogEntity>> {
		const {
			keyword,
			pageSize,
			skip,
			action,
			success,
			startDateCreated,
			endDateCreated,
		} = params;

		const queryBuilder = this.logRepository.createQueryBuilder('log');

		if (keyword) {
			queryBuilder.andWhere(
				new Brackets((qb) => {
					qb.where('log.content LIKE :content', {
						content: `%${keyword}%`,
					})
						.orWhere('log.email LIKE :email', {
							email: `%${keyword}%`,
						})
						.orWhere('log.userCreatorId LIKE :userCreatorId', {
							userCreatorId: `%${keyword}%`,
						})
						.orWhere('log.ip LIKE :ip', {
							ip: `%${keyword}%`,
						})
						.orWhere('log.country LIKE :country', {
							country: `%${keyword}%`,
						})
						.orWhere('log.city LIKE :city', {
							city: `%${keyword}%`,
						})
						.orWhere('log.originalUrl LIKE :originalUrl', {
							originalUrl: `%${keyword}%`,
						})
						.orWhere('log.statusCode LIKE :statusCode', {
							statusCode: `%${keyword}%`,
						})
						.orWhere('log.userAgent LIKE :userAgent', {
							userAgent: `%${keyword}%`,
						})
						.orWhere('log.note LIKE :note', {
							note: `%${keyword}%`,
						});
				}),
			);
		}

		if (action) {
			queryBuilder.andWhere('log.action LIKE :action', {
				action: `%${action}%`,
			});
		}

		if (success !== undefined) {
			queryBuilder.andWhere('log.success = :success', {
				success,
			});
		}

		if (startDateCreated && endDateCreated) {
			queryBuilder.andWhere(
				`log.dateCreated BETWEEN :startDateCreated AND :endDateCreated`,
				{ startDateCreated, endDateCreated },
			);
		}
		queryBuilder
			.orderBy('log.dateCreated', 'DESC')
			.skip(skip)
			.take(pageSize);

		const [data, total] = await queryBuilder.getManyAndCount();

		return new ListResponse(data, total);
	}

	async findOne(data: CheckRecentLogDto) {
		const { fifteenMinutesAgo, ...queryData } = data;

		return await this.logRepository.findOne({
			where: {
				...queryData,
				dateCreated: MoreThan(fifteenMinutesAgo),
			},
		});
	}
}
