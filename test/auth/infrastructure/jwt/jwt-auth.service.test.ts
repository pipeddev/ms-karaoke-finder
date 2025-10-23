import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/auth/infrastructure/jwt/jwt-auth.service';
import { DeviceEntity } from 'src/auth/domain/entities/device.entity';
import { JwtPayload } from 'src/auth/domain/interface/jwt-payload.interface';

describe('JwtAuthService', () => {
  let service: JwtAuthService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    service = new JwtAuthService(jwtService);
  });

  describe('issueToken', () => {
    it('should issue a token for a device', async () => {
      const device: DeviceEntity = { deviceId: 'device-123' } as DeviceEntity;
      const expectedToken = 'jwt.token.here';

      jwtService.sign.mockReturnValue(expectedToken);

      const result = await service.issueToken(device);

      expect(jwtService.sign).toHaveBeenCalledWith({
        deviceId: 'device-123',
        type: 'device_access',
      });
      expect(result).toBe(expectedToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify and return payload for valid device access token', async () => {
      const payload: JwtPayload = {
        deviceId: 'device-123',
        type: 'device_access',
      };
      jwtService.verify.mockReturnValue(payload);

      const result = await service.verifyToken('valid.token');

      expect(result).toEqual(payload);
    });

    it('should return null if payload type is not device_access', async () => {
      const payload = { deviceId: 'device-123', type: 'other_type' };
      jwtService.verify.mockReturnValue(payload as JwtPayload);

      const result = await service.verifyToken('invalid.token');

      expect(result).toBeNull();
    });

    it('should return null if deviceId is missing', async () => {
      const payload = { type: 'device_access' };
      jwtService.verify.mockReturnValue(payload as JwtPayload);

      const result = await service.verifyToken('invalid.token');

      expect(result).toBeNull();
    });

    it('should return null and log error on verification failure', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      const result = await service.verifyToken('expired.token');

      expect(result).toBeNull();
    });
  });

  describe('decodeToken', () => {
    it('should decode a valid token', () => {
      const payload: JwtPayload = {
        deviceId: 'device-123',
        type: 'device_access',
      };
      jwtService.verify.mockReturnValue(payload);

      const result = service.decodeToken('valid.token');

      expect(result).toEqual(payload);
    });

    it('should return null for invalid token', () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = service.decodeToken('invalid.token');

      expect(result).toBeNull();
    });
  });

  describe('extractDeviceId', () => {
    it('should extract deviceId from valid token', () => {
      const payload: JwtPayload = {
        deviceId: 'device-123',
        type: 'device_access',
      };
      jwtService.verify.mockReturnValue(payload);

      const result = service.extractDeviceId('valid.token');

      expect(result).toBe('device-123');
    });

    it('should return null for invalid token', () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = service.extractDeviceId('invalid.token');

      expect(result).toBeNull();
    });

    it('should return null when payload has no deviceId', () => {
      const payload = { type: 'device_access' };
      jwtService.verify.mockReturnValue(payload);

      const result = service.extractDeviceId('valid.token');

      expect(result).toBeNull();
    });
  });
});
