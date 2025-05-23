// jwt.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class JwtService {
	private expiresIn: string = '1h';

	constructor(
		private readonly jwtService: NestJwtService,
		private readonly configService: ConfigService,
	) {
		this.expiresIn =
			this.configService.get<string>('JWT_EXPIRES_IN') || '1h';
	}

	generateToken(payload: JwtPayload) {
		return this.jwtService.sign(payload, { expiresIn: this.expiresIn });
	}

	verifyToken(token: string) {
		return this.jwtService.verify(token);
	}
}
