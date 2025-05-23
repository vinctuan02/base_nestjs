import { EventType } from '../enum/auth0.enum';

export interface LoginEventBody {
	type: EventType;
	sub: string;
	email: string;
	name: string;
	picture: string;
	timestamp: string;
}
