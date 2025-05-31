import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Job, scheduleJob } from 'node-schedule';
import { LessThan, Repository } from 'typeorm';
import { isMainThread } from 'worker_threads';
import { LogEntity } from '../entities/log.entity';

const DEFAULT_TIME = '08:41';

@Injectable()
export class LogScheduleService {
	private readonly logger = new Logger(LogScheduleService.name);
	private currentJob: Job | null = null;
	private readonly daySaveLog = 365;

	constructor(
		@InjectRepository(LogEntity)
		private readonly logRepository: Repository<LogEntity>,
	) {
		if (isMainThread) {
			this.scheduleTask();
		}
	}

	private scheduleTask(): void {
		const timeUpdateData = DEFAULT_TIME;
		const [hour, minute, second = '00'] = timeUpdateData
			.split(':')
			.map((x) => parseInt(x));

		if (this.currentJob) {
			this.currentJob.cancel(); // Hủy job cũ nếu có
		}

		this.currentJob = scheduleJob({ hour, minute, second }, () =>
			this.deleteLog(),
		);
	}

	private async deleteLog() {
		const dayDeleteLog = dayjs().subtract(this.daySaveLog, 'day').toDate();
		await this.logRepository.delete({
			dateCreated: LessThan(dayDeleteLog),
		});
		this.logger.log('Deleted log');
	}
}
