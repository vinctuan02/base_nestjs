import { DateField } from 'src/dashboard/enum/date-filed.enum';
import { FormatDate } from 'src/helper/enum/date.enum';

export interface IGetDataGroupByDate {
	startDate: Date;
	endDate: Date;
	dateField: DateField;
	groupFormat: FormatDate;
	timezone: string;
}
