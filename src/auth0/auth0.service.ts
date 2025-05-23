import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Auth0UserInfo } from 'src/auth/interfaces/auth.interface';
import { UserAuth0Service } from 'src/user/services/user-auth0.service';
import { Auth0EndpointService } from './auth0.endpoint.service';
import { Auth0Endpoint } from './enum/auth0.enum';
import { LoginEventBody } from './interfaces/auth0.interface';

@Injectable()
export class Auth0Service {
	constructor(
		private readonly userAuth0Service: UserAuth0Service,
		private readonly configService: ConfigService,
		private readonly auth0EndpointService: Auth0EndpointService,
	) {}

	async handleWebhook(body: LoginEventBody) {
		const { type, sub, email, name, picture } = body;

		if (type === 'signup') {
			const existing = await this.userAuth0Service.findByAuth0Sub(sub);
			if (!existing) {
				await this.userAuth0Service.createFromAuth0({
					sub,
					email,
					name,
					picture,
				});
			}
		}
	}

	async getUserInfoFromAuth0(req: Request): Promise<Auth0UserInfo | null> {
		const authHeader = req.headers['authorization'];
		const accessToken = authHeader?.startsWith('Bearer ')
			? authHeader.split(' ')[1]
			: null;

		if (!accessToken) return null;

		try {
			const res = await fetch(
				this.auth0EndpointService.getUrl(Auth0Endpoint.USERINFO),
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				},
			);

			if (!res.ok) return null;

			return await res.json();
		} catch {
			return null;
		}
	}
}
