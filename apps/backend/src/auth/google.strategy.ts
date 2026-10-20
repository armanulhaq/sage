import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    // Configure Passport's Google Strategy:
    // - clientID & clientSecret: generated from Google Cloud Console
    // - callbackURL: where Google redirects the user after login
    // - scope: what permissions we request from Google ('email', 'profile')
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  // Passport calls this method automatically after Google redirects back with an authorization code
  // and exchanges it for the user's Google Profile.
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    // 1. Extract the profile fields Google sent us
    const { id, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value;
    const avatar = photos?.[0]?.value ?? null;

    if (!email) {
      return done(new Error('No email found in Google profile'), undefined);
    }

    // 2. Find or create the user in our PostgreSQL database
    const user = await this.authService.validateGoogleUser({
      googleId: id,
      email,
      name: displayName || 'Google User',
      avatar,
    });

    // 3. Passing `user` to done() tells Passport: "Authentication successful, attach this user to req.user"
    done(null, user);
  }
}
