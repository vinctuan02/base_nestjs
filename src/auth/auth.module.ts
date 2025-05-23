import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth0Module } from 'src/auth0/auth0.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { Auth0Guard } from './guards/auth0.guard';
import { JwtGuard } from './guards/jwt.guard';
import { AuthService } from './services/auth.service';
import { Auth0Strategy } from './strategies/auth0.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [PassportModule, JwtModule, Auth0Module, UserModule],
	providers: [AuthService, Auth0Strategy, JwtStrategy, Auth0Guard, JwtGuard],
	controllers: [AuthController],
})
export class AuthModule {}
