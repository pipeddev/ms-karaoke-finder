import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DeviceEntity } from 'src/auth/domain/entities/device.entity';
import { JwtPayload } from 'src/auth/domain/interface/jwt-payload.interface';
import { AuthRepository } from 'src/auth/domain/repositories/auth.repository';
import { LoggerHelper } from 'src/shared/logger/logger';

@Injectable()
export class JwtAuthService implements AuthRepository {
  private readonly logger = new LoggerHelper(JwtAuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  issueToken(device: DeviceEntity): Promise<string> {
    const payload: JwtPayload = {
      deviceId: device.deviceId,
      type: 'device_access',
    };

    const token = this.jwtService.sign(payload);
    return Promise.resolve(token);
  }

  async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      if (payload.type === 'device_access' && payload.deviceId) {
        return Promise.resolve(payload);
      }

      return Promise.resolve(null);
    } catch (error) {
      this.logger.debugError('verifyToken', error as Error);
      return Promise.resolve(null);
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  extractDeviceId(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.deviceId || null;
  }
}
