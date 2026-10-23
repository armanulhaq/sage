import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// AuthGuard('google') tells NestJS to trigger Passport's Google strategy.
// When applied to GET /auth/google, Passport intercepts the request and
// automatically redirects the user's browser to the Google OAuth consent page.
// When applied to GET /auth/google/callback, Passport receives Google's response
// and calls GoogleStrategy.validate().
export class GoogleAuthGuard extends AuthGuard('google') {}

