import { DeviceEntity } from '../entities/device.entity';

export interface AuthRepository {
  issueToken(device: DeviceEntity): Promise<string>;
  verifyToken(token: string): Promise<boolean>;
}
