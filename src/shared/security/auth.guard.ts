import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtAuthService } from '../../auth/infrastructure/jwt/jwt-auth.service';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { AuthenticatedUserDTO } from './dtos/authenticated-user.dto';
import { BusinessError } from '../error/business.error';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new BusinessError(
        'Missing or invalid Authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const decodedPayload = await this.jwtAuthService.verifyToken(token);
    if (!decodedPayload) {
      throw new BusinessError(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const deviceId = decodedPayload.deviceId;
    if (!deviceId) {
      throw new BusinessError(
        'Invalid token payload: missing deviceId',
        HttpStatus.UNAUTHORIZED,
      );
    }

    request.user = new AuthenticatedUserDTO(deviceId);
    return true;
  }

  private extractTokenFromHeader(request: AuthenticatedRequest): string | null {
    const authHeader = request.headers?.authorization;

    if (
      !authHeader ||
      typeof authHeader !== 'string' ||
      !authHeader.startsWith('Bearer ')
    ) {
      return null;
    }

    return authHeader.replace('Bearer ', '').trim();
  }
}
