import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Auth0Guard } from './auth/guards/auth0.guard';
import { JwtGuard } from './auth/guards/jwt.guard';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	const jwtSelfGuard = app.get(JwtGuard);
	app.useGlobalGuards(jwtSelfGuard);

	// const auth0Guard = app.get(Auth0Guard);
	// app.useGlobalGuards(auth0Guard);

	app.enableCors({
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Timezone'],
		credentials: true,
	});
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
