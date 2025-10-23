import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { AuthGuard } from 'src/shared/security/auth.guard';
import { JwtAuthService } from 'src/auth/infrastructure/jwt/jwt-auth.service';
import { AuthenticatedRequest } from 'src/shared/security/interfaces/authenticated-request.interface';
import { BusinessError } from 'src/shared/error/business.error';
import { JwtPayload } from 'src/auth/domain/interface/jwt-payload.interface';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtAuthService: jest.Mocked<JwtAuthService>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockRequest: Partial<AuthenticatedRequest>;

  beforeAll(() => {
    jwtAuthService = {
      verifyToken: jest.fn(),
    } as unknown as jest.Mocked<JwtAuthService>;

    authGuard = new AuthGuard(jwtAuthService);

    mockRequest = {
      headers: {},
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as jest.Mocked<ExecutionContext>;
  });

  describe('canActivate', () => {
    it('should return true and attach user to request when valid token is provided', async () => {
      const token = 'valid-token';
      const deviceId = 'device-123';
      mockRequest.headers = { authorization: `Bearer ${token}` };
      const payload: JwtPayload = { deviceId, type: 'access' };
      jwtAuthService.verifyToken.mockResolvedValue(payload);

      const result = await authGuard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user?.deviceId).toBe(deviceId);
      expect(jwtAuthService.verifyToken).toHaveBeenCalledWith(token);
    });

    it('should throw BusinessError when authorization header is missing', async () => {
      mockRequest.headers = {};

      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        new BusinessError(
          'Missing or invalid Authorization header',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should throw BusinessError when authorization header does not start with Bearer', async () => {
      mockRequest.headers = { authorization: 'InvalidToken' };

      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        new BusinessError(
          'Missing or invalid Authorization header',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should throw BusinessError when token verification fails', async () => {
      mockRequest.headers = { authorization: 'Bearer invalid-token' };
      jwtAuthService.verifyToken.mockResolvedValue(null);

      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        new BusinessError('Invalid or expired token', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw BusinessError when token payload is missing deviceId', async () => {
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jwtAuthService.verifyToken.mockResolvedValue({ type: 'access' } as any);

      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        new BusinessError(
          'Invalid token payload: missing deviceId',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should handle authorization header with extra spaces', async () => {
      const token = 'valid-token';
      const deviceId = 'device-123';
      mockRequest.headers = { authorization: `Bearer  ${token}  ` };
      const payload: JwtPayload = { deviceId, type: 'access' };
      jwtAuthService.verifyToken.mockResolvedValue(payload);

      const result = await authGuard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(jwtAuthService.verifyToken).toHaveBeenCalledWith(token);
    });

    it('should throw BusinessError when authorization header is not a string', async () => {
      mockRequest.headers = {
        authorization: ['Bearer', 'token'] as unknown as string,
      };

      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        new BusinessError(
          'Missing or invalid Authorization header',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should throw BusinessError when authorization header is empty string', async () => {
      mockRequest.headers = { authorization: '' };

      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        new BusinessError(
          'Missing or invalid Authorization header',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should throw BusinessError when token is empty after Bearer', async () => {
      mockRequest.headers = { authorization: 'Bearer ' };

      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        new BusinessError(
          'Missing or invalid Authorization header',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should work with different token types', async () => {
      const token = 'refresh-token';
      const deviceId = 'device-456';
      mockRequest.headers = { authorization: `Bearer ${token}` };
      const payload: JwtPayload = { deviceId, type: 'refresh' };
      jwtAuthService.verifyToken.mockResolvedValue(payload);

      const result = await authGuard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockRequest.user?.deviceId).toBe(deviceId);
    });

    it('should throw BusinessError when verifyToken throws an error', async () => {
      mockRequest.headers = { authorization: 'Bearer error-token' };
      jwtAuthService.verifyToken.mockRejectedValue(
        new Error('Verification error'),
      );

      await expect(
        authGuard.canActivate(mockExecutionContext),
      ).rejects.toThrow();
    });
  });
});
