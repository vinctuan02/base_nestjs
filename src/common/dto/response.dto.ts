import {
	DEFAULT_SUCCESS_MESSAGE,
	DEFAULT_SUCCESS_STATUS_CODE,
} from '../constants/message.constants';

export class ResponseSuccessDto<T> {
	statusCode: number;
	message: string;
	data?: T;

	constructor({
		statusCode = DEFAULT_SUCCESS_STATUS_CODE,
		message = DEFAULT_SUCCESS_MESSAGE,
		data,
	}: {
		statusCode?: number;
		message?: string;
		data?: T;
	} = {}) {
		this.statusCode = statusCode;
		this.message = message;
		this.data = data;
	}
}

export class MetaData {
	currentPage: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;

	constructor({
		currentPage = 1,
		pageSize = 0,
		totalItems = 0,
	}: Partial<MetaData> = {}) {
		this.currentPage = currentPage;
		this.pageSize = pageSize;
		this.totalItems = totalItems;
		this.totalPages = pageSize > 0 ? Math.ceil(totalItems / pageSize) : 0;
	}
}

export class DataListSuccessDto<T> {
	item: T[];
	metaData: MetaData;

	constructor(item: T[], metaData?: Partial<MetaData>) {
		this.item = item;
		this.metaData = new MetaData({
			currentPage: metaData?.currentPage ?? 1,
			pageSize: metaData?.pageSize ?? item.length,
			totalItems: metaData?.totalItems ?? item.length,
		});
	}
}
