import { LevelLog } from '../enum/log.enum';

export interface ILog {
	action?: string;
	ip?: string;
	country?: string;
	city?: string;
	originalUrl?: string;
	statusCode?: number;
	content?: string;
	response?: any;
	email?: string;
	userCreatorId?: string;
	note?: string;
	success?: boolean;
	userAgent?: string;
	level?: LevelLog;
}
