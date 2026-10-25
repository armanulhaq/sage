import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { PresignedUrlInput, PresignedUrlResponse } from 'contract';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  private readonly allowedAvatarTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ];

  private readonly allowedSourceTypes = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/epub+zip',
    'text/html',
  ];

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION') || 'ap-southeast-2';
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME') || 'sage-file-upload';

    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    this.s3Client = new S3Client({
      region: this.region,
      credentials:
        accessKeyId && secretAccessKey
          ? {
              accessKeyId,
              secretAccessKey,
            }
          : undefined,
    });
  }

  async getPresignedUploadUrl(
    input: PresignedUrlInput,
    userId: string,
  ): Promise<PresignedUrlResponse> {
    const { fileName, fileType, folder } = input;

    // Validate MIME types based on intended target folder
    if (folder === 'avatars') {
      if (!this.allowedAvatarTypes.includes(fileType)) {
        throw new BadRequestException(
          `Invalid file type for avatar. Allowed types: ${this.allowedAvatarTypes.join(', ')}`,
        );
      }
    } else if (folder === 'sources') {
      if (!this.allowedSourceTypes.includes(fileType)) {
        throw new BadRequestException(
          `Invalid file type for knowledge source. Allowed types: ${this.allowedSourceTypes.join(', ')}`,
        );
      }
    }

    // Sanitize filename & create unique collision-resistant key
    const extension = path.extname(fileName).toLowerCase() || '';
    const rawBaseName = path.basename(fileName, extension);
    const sanitizedBase = rawBaseName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const uniqueKey = `${folder}/${uuidv4()}-${sanitizedBase}${extension}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: uniqueKey,
        ContentType: fileType,
        Metadata: {
          uploadedBy: userId,
          originalName: encodeURIComponent(fileName),
        },
      });

      // Presigned PUT URL valid for 5 minutes (300 seconds)
      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 300,
      });

      const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${uniqueKey}`;

      return {
        uploadUrl,
        fileUrl,
        key: uniqueKey,
      };
    } catch (err: any) {
      this.logger.error(`Failed to generate presigned URL: ${err.message}`, err.stack);
      throw new BadRequestException('Failed to generate upload URL');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (err: any) {
      this.logger.warn(`Failed to delete file ${key} from S3: ${err.message}`);
    }
  }
}
