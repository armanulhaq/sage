import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//AuthGuard('jwt') tells NestJS to use Passport's jwt authentication strategy.
export class JwtAuthGuard extends AuthGuard('jwt') {}
