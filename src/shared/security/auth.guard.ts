import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../../auth/infrastructure/jwt/jwt.service';
import { JSendDTO } from '../jsend/jsend';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { AuthenticatedUserDTO } from './dtos/authenticated-user.dto';
import { BusinessError } from '../error/business.error';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        JSendDTO.fail({ message: 'Missing or invalid Authorization header' }),
      );
    }

    const isValidToken = await this.jwtService.verifyToken(token);
    if (!isValidToken) {
      throw new UnauthorizedException(
        JSendDTO.fail({ message: 'Invalid or expired token' }),
      );
    }

    const deviceId = this.jwtService.extractDeviceId(token);
    if (!deviceId) {
      /*throw new UnauthorizedException(
        JSendDTO.fail({ message: 'Invalid token payload' }),
      );*/
      throw new BusinessError(
        'Invalid token payload: missing deviceId',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Crear y adjuntar el DTO al request
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
