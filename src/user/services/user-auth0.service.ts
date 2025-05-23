import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth0UserInfo } from 'src/auth/interfaces/auth.interface';
import { Repository } from 'typeorm';
import { UserAuth0 } from '../entities/user-auth0.entity';
import { RoleUser } from '../enum/user.enums';

@Injectable()
export class UserAuth0Service {
	constructor(
		@InjectRepository(UserAuth0)
		private readonly userRepository: Repository<UserAuth0>,
	) {}

	async findByAuth0Sub(auth0Sub: string): Promise<UserAuth0 | null> {
		return this.userRepository.findOne({ where: { auth0Sub } });
	}

	async createFromAuth0(userInfo: Auth0UserInfo): Promise<UserAuth0> {
		const newUser = this.userRepository.create({
			auth0Sub: userInfo.sub,
			email: userInfo.email,
			name: userInfo.name || userInfo.nickname || '',
			picture: userInfo.picture || '',
			role: RoleUser.USER,
		});

		return this.userRepository.save(newUser);
	}
}
