import { Controller, Get, Query } from '@nestjs/common';
import { FileUrlService } from '../services/file-url.service';
import { QueryGetListFileDto } from '../dto/req/query-get-list.dto';
import { ResponseSuccessDto } from 'src/common/dto/response.dto';
import { DataListSuccessDto } from 'src/common/dto/response.dto';
import { FileWithReadUrl } from '../interface/file.interface';

@Controller('file-url')
export class FileUrlController {
  constructor(private readonly fileUrlService: FileUrlService) { }

  @Get()
  async getListFileUrl(@Query() query: QueryGetListFileDto): Promise<ResponseSuccessDto<DataListSuccessDto<FileWithReadUrl>>> {
    const result = await this.fileUrlService.getListFileUrl(query);
    return new ResponseSuccessDto({ data: result });
  }
}
