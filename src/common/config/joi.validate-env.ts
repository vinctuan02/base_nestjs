import * as Joi from 'joi';
import { DBType } from '../typeorm/enum/db-type.enum';

export const envValidationSchema = Joi.object({
	DB_TYPE: Joi.string()
		.valid(...Object.values(DBType))
		.required(),
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.number().required(),
	DB_USER: Joi.string().required(),
	DB_PASS: Joi.string().required(),
	DB_NAME: Joi.string().required(),

	PORT: Joi.number().required(),
	ENCRYPTION_KEY: Joi.string().required(),

	// jwt
	JWT_SECRET: Joi.string().required(),
	JWT_EXPIRES_IN: Joi.string().required(),

	// auth0
	AUTH0_DOMAIN: Joi.string().required(),
	AUTH0_AUDIENCE: Joi.string().required(),
	AUTH0_WEBHOOK_SECRET: Joi.string().required(),
});
