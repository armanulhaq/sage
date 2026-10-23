import { Controller, UseGuards } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { contract } from 'contract';
import { PersonalityService } from './personality.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller()
export class PersonalityController {
  constructor(private readonly personalityService: PersonalityService) {}

  @UseGuards(JwtAuthGuard)
  @TsRestHandler(contract.personality.create)
  async create(@CurrentUser() user: User) {
    return tsRestHandler(contract.personality.create, async ({ body }) => {
      const response = await this.personalityService.create(body, user);
      return {
        status: 201,
        body: response,
      };
    });
  }

  @UseGuards(JwtAuthGuard)
  @TsRestHandler(contract.personality.list)
  async list(@CurrentUser() user: User) {
    return tsRestHandler(contract.personality.list, async () => {
      const response = await this.personalityService.findAllAccessible(user.id);
      return {
        status: 200,
        body: response,
      };
    });
  }

  @UseGuards(JwtAuthGuard)
  @TsRestHandler(contract.personality.get)
  async get(@CurrentUser() user: User) {
    return tsRestHandler(contract.personality.get, async ({ params }) => {
      const response = await this.personalityService.findById(params.id, user.id);
      return {
        status: 200,
        body: response,
      };
    });
  }
}
