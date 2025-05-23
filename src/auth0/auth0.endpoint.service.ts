import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth0Endpoint } from './enum/auth0.enum';

@Injectable()
export class Auth0EndpointService {
	private domain: string;

	constructor(private configService: ConfigService) {
		this.domain = this.configService.get<string>('AUTH0_DOMAIN');
	}

	getUrl(endpoint: Auth0Endpoint): string {
		switch (endpoint) {
			case Auth0Endpoint.AUTHORIZE:
				return `${this.domain}/authorize`;
			case Auth0Endpoint.TOKEN:
				return `${this.domain}/oauth/token`;
			case Auth0Endpoint.USERINFO:
				return `${this.domain}/userinfo`;
			case Auth0Endpoint.JWKS:
				return `${this.domain}/.well-known/jwks.json`;
			case Auth0Endpoint.LOGOUT:
				return `${this.domain}/v2/logout`;
			case Auth0Endpoint.USERS:
				return `${this.domain}/api/v2/users`;
			case Auth0Endpoint.CHANGE_PASSWORD:
				return `${this.domain}/dbconnections/change_password`;
			default:
				throw new Error('Unknown Auth0 endpoint');
		}
	}
}
