import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataListSuccessDto } from 'src/common/dto/response.dto';
import { Repository } from 'typeorm';
import { QueryGetListFileDto } from '../dto/req/query-get-list.dto';
import { SubmitUploadFileDto } from '../dto/req/submit-upload.dto';
import { File } from '../entities/file.entity';
import { PasswordService } from 'src/helper/services/password.service';
import { TypeID } from 'src/common/typeorm/enum/db-type.enum';

@Injectable()
export class FileService {
	constructor(
		@InjectRepository(File)
		private readonly fileRepository: Repository<File>,
		private readonly passwordService: PasswordService,
	) { }

	async submitUploadFile(payload: SubmitUploadFileDto): Promise<File> {
		const { secretKey } = payload;

		const file = await this.fileRepository.create({
			...payload,
			secretKey: this.passwordService.encrypt(secretKey),
		});
		return this.fileRepository.save(file);
	}

	async getListFile(
		query: QueryGetListFileDto,
	): Promise<DataListSuccessDto<File>> {
		const { page, pageSize } = query;

		const [files, totalItems] = await this.fileRepository.findAndCount({
			skip: query.skip,
			take: query.pageSize,
		});

		const result = files.map(file => {
			if (file.secretKey) {
				try {
					file.secretKey = this.passwordService.decrypt(file.secretKey);
				} catch (error) {
					file.secretKey = null;
				}
			}
			return file;
		});

		return new DataListSuccessDto<File>(result, {
			currentPage: page,
			pageSize,
			totalItems,
		});
	}

	async getFileById(id: TypeID): Promise<File> {
		const file = await this.fileRepository.findOne({ where: { id } });

		if (!file) {
			throw new NotFoundException('File not found');
		}

		if (file.secretKey) {
			try {
				file.secretKey = this.passwordService.decrypt(file.secretKey);
			} catch (error) {
				console.error('Failed to decrypt secretKey:', error);
				throw new InternalServerErrorException('Unable to decrypt file secret key');
			}
		}

		return file;
	}
}
