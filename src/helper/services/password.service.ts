import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';

@Injectable()
export class PasswordService {
	constructor(private readonly configService: ConfigService) {}

	private readonly ENCRYPTION_KEY =
		this.configService.get<string>('ENCRYPTION_KEY');
	private readonly IV_LENGTH = 16;

	encrypt(text: string): string {
		const iv = crypto.randomBytes(this.IV_LENGTH);
		const cipher = crypto.createCipheriv(
			'aes-256-cbc',
			Buffer.from(this.ENCRYPTION_KEY),
			iv,
		);
		let encrypted = cipher.update(text, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		return `${iv.toString('hex')}:${encrypted}`;
	}

	decrypt(text: string): string {
		const [ivHex, encryptedText] = text.split(':');
		const iv = Buffer.from(ivHex, 'hex');
		const decipher = crypto.createDecipheriv(
			'aes-256-cbc',
			Buffer.from(this.ENCRYPTION_KEY),
			iv,
		);
		let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	}

	async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 10);
	}

	async comparePassword(password: string, hash: string): Promise<boolean> {
		if (!password || !hash) {
			return false;
		}

		return bcrypt.compare(password, hash);
	}
}
