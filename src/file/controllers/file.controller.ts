import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
	DataListSuccessDto,
	ResponseSuccessDto,
} from 'src/common/dto/response.dto';
import { QueryGetListFileDto } from '../dto/req/query-get-list.dto';
import { SubmitUploadFileDto } from '../dto/req/submit-upload.dto';
import { File } from '../entities/file.entity';
import { FileService } from '../services/file.service';
import { TypeID } from 'src/common/typeorm/enum/db-type.enum';

@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService) { }

	@Post()
	async submitUploadFile(
		@Body() payload: SubmitUploadFileDto,
	): Promise<ResponseSuccessDto<File>> {
		const result = await this.fileService.submitUploadFile(payload);
		return new ResponseSuccessDto({ data: result });
	}

	@Get()
	async getListFile(
		@Query() query: QueryGetListFileDto,
	): Promise<ResponseSuccessDto<DataListSuccessDto<File>>> {
		const result = await this.fileService.getListFile(query);
		return new ResponseSuccessDto({ data: result });
	}

	@Get(':id')
	async getFileById(
		@Param('id') id: TypeID,
	): Promise<ResponseSuccessDto<File>> {
		const result = await this.fileService.getFileById(id);
		return new ResponseSuccessDto({ data: result });
	}
}
