import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { contract } from 'contract';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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

  // When user clicks "Continue with Google" on frontend, the browser navigates here.
  // GoogleAuthGuard tells Passport to generate the Google OAuth authorization URL
  // and issues an HTTP 302 redirect sending the user to Google's consent screen.
  @Get('auth/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Left empty intentionally: Passport's GoogleAuthGuard handles the 302 redirect automatically.
  }

  // After the user signs in on Google and approves, Google redirects back here with a "?code=..." query param.
  // GoogleAuthGuard intercepts this request, exchanges the code with Google for the user's profile,
  // runs GoogleStrategy.validate(), and attaches the returned User entity to `req.user`.
  // We sign our JWT token, set the cookie directly on the browser, and redirect directly to /dashboard!
  @Get('auth/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@CurrentUser() user: User, @Res() res: Response) {
    const accessToken = await this.authService.generateToken(user);
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    // Set cookie directly on the browser
    res.cookie('sage_token', accessToken, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    return res.redirect(`${frontendUrl}/mentors`);
  }
}
