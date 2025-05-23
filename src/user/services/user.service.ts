import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataListSuccessDto } from 'src/common/dto/response.dto';
import { TypeID } from 'src/common/typeorm/enum/db-type.enum';
import { PasswordService } from 'src/helper/services/password.service';
import { JwtPayload } from 'src/jwt/interfaces/jwt.interface';
import { Repository } from 'typeorm';
import { UserCreateDto } from '../dto/user.create.dto';
import { QueryGetDetailUserDto } from '../dto/user.query-get-detail.dto';
import { QueryGetListUserDto } from '../dto/user.query-get-list.dto';
import { User } from '../entities/user.entity';
import { UserFieldQueryEnum } from '../enum/user.field-query.enum';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly passwordService: PasswordService,
	) {}

	async createUser(payload: UserCreateDto): Promise<User> {
		const { email, password } = payload;

		const isExist = await this.isExist(email, UserFieldQueryEnum.EMAIL);
		if (isExist) {
			throw new BadRequestException('User already exists');
		}

		const hashedPassword =
			await this.passwordService.hashPassword(password);
		payload.password = hashedPassword;

		const newUser = this.userRepository.create(payload);
		return this.userRepository.save(newUser);
	}

	async getListUser(
		query: QueryGetListUserDto,
	): Promise<DataListSuccessDto<User>> {
		const { page, pageSize } = query;
		const [users, totalItems] = await this.userRepository.findAndCount({
			skip: query.skip,
			take: query.pageSize,
		});

		return new DataListSuccessDto<User>(users, {
			currentPage: page,
			pageSize,
			totalItems,
		});
	}

	async isExist(
		value: TypeID | string,
		fieldName: UserFieldQueryEnum,
	): Promise<boolean> {
		const user = await this.userRepository.findOne({
			where: { [fieldName]: value },
		});
		return !!user;
	}

	async getDetailUser(
		value: TypeID | string,
		query: QueryGetDetailUserDto,
	): Promise<User> {
		const { fieldName } = query;

		const user = await this.userRepository.findOne({
			where: { [fieldName]: value },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	async validateUser(email: string, password: string): Promise<JwtPayload> {
		const user = await this.userRepository.findOne({ where: { email } });

		const validatedUser = await this.passwordService.comparePassword(
			password,
			user.password,
		);

		if (!validatedUser) {
			throw new UnauthorizedException('Invalid email or password');
		}

		return { email: user.email, role: user.role };
	}
}
