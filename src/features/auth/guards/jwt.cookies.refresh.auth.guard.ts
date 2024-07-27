import { AuthGuard } from '@nestjs/passport';

export class JwtCookieRefreshAuthGuard extends AuthGuard('jwt-refresh') {}
