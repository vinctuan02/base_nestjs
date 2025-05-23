import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { envValidationSchema } from './common/config/joi.validate-env';
import { DatabaseOptions } from './common/typeorm/ormconfig';
import { DashboardModule } from './dashboard/dashboard.module';
import { FileModule } from './file/file.module';
import { HelperModule } from './helper/helper.module';
import { LoggerModule } from './logger/logger.module';
import { MinIOModule } from './minio/minio.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: envValidationSchema,
		}),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useClass: DatabaseOptions,
		}),
		MinIOModule,
		FileModule,
		OrderModule,
		UserModule,
		AuthModule,
		HelperModule,
		DashboardModule,
		LoggerModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
