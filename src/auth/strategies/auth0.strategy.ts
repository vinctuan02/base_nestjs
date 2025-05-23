import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Auth0Service } from 'src/auth0/auth0.service';
import { UserAuth0Service } from 'src/user/services/user-auth0.service';
import { CurrentUser } from '../interfaces/auth.interface';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0-jwt') {
	constructor(
		private readonly configService: ConfigService,
		private readonly userAuth0Service: UserAuth0Service,
		private readonly auth0Service: Auth0Service,
	) {
		const auth0Url = configService.get<string>('AUTH0_DOMAIN');
		const jwksUri = `${auth0Url}/.well-known/jwks.json`;
		const audienceUrl = configService.get<string>('AUTH0_AUDIENCE');
		const issuerUrl = `${auth0Url}/`;

		super({
			secretOrKeyProvider: jwksRsa.passportJwtSecret({
				cache: true,
				rateLimit: true,
				jwksRequestsPerMinute: 5,
				jwksUri,
			}),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			audience: audienceUrl,
			issuer: issuerUrl,
			algorithms: ['RS256'],
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtPayload): Promise<CurrentUser> {
		const auth0Sub = payload.sub;

		let user = await this.userAuth0Service.findByAuth0Sub(auth0Sub);

		if (!user) {
			const userInfo = await this.auth0Service.getUserInfoFromAuth0(req);
			user = await this.userAuth0Service.createFromAuth0(userInfo);
		}

		return { ...payload, ...user };
	}
}
