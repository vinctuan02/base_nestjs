import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
@Module({
	imports: [
		ConfigModule,
		NestJwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn:
						configService.get<string>('JWT_EXPIRES_IN') || '1h',
				},
			}),
		}),
	],
	providers: [JwtService],
	exports: [JwtService],
})
export class JwtModule {}
