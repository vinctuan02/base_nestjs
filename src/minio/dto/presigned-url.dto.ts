import { IsNotEmpty } from 'class-validator';

export class GetPresignedUploadDto {
	@IsNotEmpty()
	endpoint: string;

	@IsNotEmpty()
	accessKey: string;

	@IsNotEmpty()
	secretKey: string;

	@IsNotEmpty()
	bucketName: string;

	@IsNotEmpty()
	key: string;

	@IsNotEmpty()
	contentType: string;
}

export class GetPresignedReadDto {
	@IsNotEmpty()
	endpoint: string;

	@IsNotEmpty()
	accessKey: string;

	@IsNotEmpty()
	secretKey: string;

	@IsNotEmpty()
	bucketName: string;

	@IsNotEmpty()
	key: string;
}

export class GetPresignedReadUrlsDto extends GetPresignedReadDto {
	@IsNotEmpty()
	fileId: number;
}

export class GetPresignedDownloadDto {
	@IsNotEmpty()
	endpoint: string;

	@IsNotEmpty()
	accessKey: string;

	@IsNotEmpty()
	secretKey: string;

	@IsNotEmpty()
	bucketName: string;

	@IsNotEmpty()
	key: string;
}
