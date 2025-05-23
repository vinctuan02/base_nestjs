import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperModule } from 'src/helper/helper.module';
import { UserAuth0 } from './entities/user-auth0.entity';
import { User } from './entities/user.entity';
import { UserAuth0Service } from './services/user-auth0.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
	imports: [TypeOrmModule.forFeature([User, UserAuth0]), HelperModule],
	controllers: [UserController],
	providers: [UserService, UserAuth0Service],
	exports: [UserService, UserAuth0Service],
})
export class UserModule {}
