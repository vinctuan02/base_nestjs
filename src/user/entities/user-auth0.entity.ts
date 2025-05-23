import { BaseEntity } from 'src/common/entity/base-entity';
import { Column, Entity, Unique } from 'typeorm';
import { RoleUser } from '../enum/user.enums';

@Entity('user_auth0')
@Unique(['auth0Sub'])
@Unique(['email'])
export class UserAuth0 extends BaseEntity {
	@Column()
	auth0Sub: string;

	@Column()
	email: string;

	@Column({ nullable: true })
	name: string;

	@Column({ nullable: true })
	picture: string;

	@Column({ enum: RoleUser, default: RoleUser.USER })
	role: RoleUser;

	@Column({ default: true })
	isActive: boolean;
}
