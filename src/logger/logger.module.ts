import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperModule } from 'src/helper/helper.module';
import { Logger } from './entities/logger.entity';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { LoggerMiddleware } from './middlewares/request-logger.middleware';

@Module({
	imports: [TypeOrmModule.forFeature([Logger]), HelperModule],
	controllers: [LoggerController],
	providers: [LoggerService],
	exports: [LoggerService],
})
export class LoggerModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
