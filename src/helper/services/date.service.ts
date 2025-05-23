import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { DataSource } from 'typeorm';
import { FormatDate, TypeGroupDate } from '../enum/date.enum';
dayjs.extend(isSameOrBefore);
@Injectable()
export class DateService {
	constructor(
		@InjectDataSource()
		private dataSource: DataSource,
	) {}

	async getCurrentTimes() {
		const backendTime = new Date();

		const dbTime: { dbTime: string }[] = await this.dataSource.query(
			'SELECT NOW() as "dbTime"',
		);

		return {
			backendTime,
			dbTime: dbTime[0].dbTime,
		};
	}

	getGroupFormat(typeGroupDate: TypeGroupDate): FormatDate {
		switch (typeGroupDate) {
			case TypeGroupDate.DAY:
				return FormatDate.DAY;
			case TypeGroupDate.MONTH:
				return FormatDate.MONTH;
			case TypeGroupDate.YEAR:
				return FormatDate.YEAR;
		}
	}

	getListDate(
		startDate: Date,
		endDate: Date,
		typeGroupDate: TypeGroupDate,
	): string[] {
		const listDate: string[] = [];
		let current = dayjs(startDate);
		const end = dayjs(endDate);

		while (current.isSameOrBefore(end)) {
			switch (typeGroupDate) {
				case TypeGroupDate.DAY:
					listDate.push(current.format(FormatDate.DAY));
					current = current.add(1, TypeGroupDate.DAY);
					break;
				case TypeGroupDate.MONTH:
					listDate.push(current.format(FormatDate.MONTH));
					current = current.add(1, TypeGroupDate.MONTH);
					break;
				case TypeGroupDate.YEAR:
					listDate.push(current.format(FormatDate.YEAR));
					current = current.add(1, TypeGroupDate.YEAR);
					break;
				default:
					throw new Error('Invalid typeGroupDate');
			}
		}

		return listDate;
	}

	getListDateAndGroupFormat(
		startDate: Date,
		endDate: Date,
		typeGroupDate: TypeGroupDate,
	): { groupFormat: FormatDate; listDate: string[] } {
		const groupFormat = this.getGroupFormat(typeGroupDate);
		const listDate = this.getListDate(startDate, endDate, typeGroupDate);

		return {
			groupFormat,
			listDate,
		};
	}
}
