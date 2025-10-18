import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { DeviceEntity } from 'src/auth/domain/entities/device.entity';
import { AuthRepository } from 'src/auth/domain/repositories/auth.repository';
import { LoggerHelper } from 'src/shared/logger/logger';

interface JwtPayload {
  deviceId: string;
  type: 'device_access';
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService implements AuthRepository {
  private readonly logger = new LoggerHelper(JwtService.name);

  constructor(private readonly nestJwtService: NestJwtService) {}

  issueToken(device: DeviceEntity): Promise<string> {
    const payload: JwtPayload = {
      deviceId: device.deviceId,
      type: 'device_access',
    };

    const token = this.nestJwtService.sign(payload);
    return Promise.resolve(token);
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const payload = this.nestJwtService.verify<JwtPayload>(token);

      const status = payload.type === 'device_access' && !!payload.deviceId;
      return Promise.resolve(status);
    } catch (error) {
      this.logger.debugError('verifyToken', error as Error);
      return false;
    }
  }

  // Método adicional para extraer el payload completo
  decodeToken(token: string): JwtPayload | null {
    try {
      return this.nestJwtService.verify<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  // Método para extraer solo el deviceId
  extractDeviceId(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.deviceId || null;
  }
}
