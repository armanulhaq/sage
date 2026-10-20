import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { contract } from 'contract';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @TsRestHandler(contract.auth.register)
  async register() {
    return tsRestHandler(contract.auth.register, async ({ body }) => {
      const response = await this.authService.register(body);
      return {
        status: 201,
        body: response,
      };
    });
  }

  @TsRestHandler(contract.auth.login)
  async login() {
    return tsRestHandler(contract.auth.login, async ({ body }) => {
      const response = await this.authService.login(body);
      return {
        status: 200,
        body: response,
      };
    });
  }

  @UseGuards(JwtAuthGuard)
  @TsRestHandler(contract.auth.getProfile)
  async getProfile(@CurrentUser() user: User) {
    return tsRestHandler(contract.auth.getProfile, async () => {
      const profile = await this.authService.getProfile(user.id);
      return {
        status: 200,
        body: profile,
      };
    });
  }
}
