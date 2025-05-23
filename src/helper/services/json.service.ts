import { Injectable } from '@nestjs/common';

@Injectable()
export class JsonService {
	safeStringify(value: any, maxLength = 10000): string {
		try {
			const str =
				typeof value === 'string' ? value : JSON.stringify(value);
			return str.length > maxLength
				? str.slice(0, maxLength) + '...[truncated]'
				: str;
		} catch {
			return '[Unserializable]';
		}
	}

	safeParse(input: any): any {
		if (typeof input !== 'string') return input;
		if (input.includes('...[truncated]')) return input;

		try {
			let parsed = JSON.parse(input);

			while (typeof parsed === 'string') {
				parsed = JSON.parse(parsed);
			}
			return parsed;
		} catch {
			return input;
		}
	}
}
