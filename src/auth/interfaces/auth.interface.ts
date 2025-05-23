import { JwtPayload } from 'jsonwebtoken';
import { TypeID } from 'src/common/typeorm/enum/db-type.enum';
import { RoleUser } from 'src/user/enum/user.enums';

export interface Auth0UserInfo {
	sub?: string;
	given_name?: string;
	family_name?: string;
	nickname?: string;
	name?: string;
	picture?: string;
	updated_at?: string;
	email?: string;
	email_verified?: boolean;
}

export interface CurrentUser extends JwtPayload, Auth0UserInfo {
	accessToken?: string;
	role?: RoleUser;
	id?: TypeID;
}
