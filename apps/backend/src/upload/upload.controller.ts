import { Controller, UseGuards } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { contract } from 'contract';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @TsRestHandler(contract.upload.getPresignedUrl)
  async getPresignedUrl(@CurrentUser() user: User) {
    return tsRestHandler(contract.upload.getPresignedUrl, async ({ body }) => {
      const response = await this.uploadService.getPresignedUploadUrl(body, user.id);
      return {
        status: 200,
        body: response,
      };
    });
  }
}
