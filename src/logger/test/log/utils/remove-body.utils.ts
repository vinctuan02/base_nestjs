import { isPlainObject } from 'lodash';

export const removeObjectValue = (data: any, keys: string[]) => {
	if (!isPlainObject(data)) return data;
	const newData = structuredClone(data);
	keys.forEach((key) => {
		if (newData[key]) {
			newData[key] = '*****************************';
		}
	});
	return newData;
};
