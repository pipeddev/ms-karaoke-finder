import { DeviceEntity } from '../entities/device.entity';
import { JwtPayload } from '../interface/jwt-payload.interface';

export interface AuthRepository {
  issueToken(device: DeviceEntity): Promise<string>;
  verifyToken(token: string): Promise<JwtPayload | null>;
}
