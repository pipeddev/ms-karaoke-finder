import { IssueTokenUseCase } from 'src/auth/application/use-cases/issue-token.usecase';
import { AuthRepository } from 'src/auth/domain/repositories/auth.repository';
import { ValidatorUtils } from 'src/shared/utils/validator.utils';
import { IssueTokenDto } from 'src/auth/interface/dto/issue-token.dto';
import { DeviceEntity } from 'src/auth/domain/entities/device.entity';

describe('IssueTokenUseCase', () => {
  let useCase: IssueTokenUseCase;
  let authRepository: jest.Mocked<AuthRepository>;
  let validatorUtils: jest.Mocked<ValidatorUtils>;

  beforeAll(() => {
    authRepository = {
      issueToken: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    validatorUtils = {
      validateOrThrowBusinessError: jest.fn(),
    } as unknown as jest.Mocked<ValidatorUtils>;

    useCase = new IssueTokenUseCase(authRepository, validatorUtils);
  });

  describe('execute', () => {
    it('should validate the DTO', async () => {
      const dto: IssueTokenDto = { deviceId: 'device-123' };
      const token = 'mock-token';
      authRepository.issueToken.mockResolvedValue(token);

      await useCase.execute(dto);

      expect(validatorUtils.validateOrThrowBusinessError).toHaveBeenCalledWith(
        dto,
      );
    });

    it('should create a DeviceEntity and issue a token', async () => {
      const dto: IssueTokenDto = { deviceId: 'device-123' };
      const token = 'mock-token';
      authRepository.issueToken.mockResolvedValue(token);

      await useCase.execute(dto);

      expect(authRepository.issueToken).toHaveBeenCalledWith(
        expect.any(DeviceEntity),
      );
    });

    it('should return a success JSendDTO with the token', async () => {
      const dto: IssueTokenDto = { deviceId: 'device-123' };
      const token = 'mock-token';
      authRepository.issueToken.mockResolvedValue(token);

      const result = await useCase.execute(dto);

      expect(result).toEqual({
        status: 'success',
        data: { token },
      });
    });

    it('should throw an error if validation fails', async () => {
      const dto: IssueTokenDto = { deviceId: 'device-123' };
      const validationError = new Error('Validation error');
      validatorUtils.validateOrThrowBusinessError.mockRejectedValue(
        validationError,
      );

      await expect(useCase.execute(dto)).rejects.toThrow('Validation error');
    });

    it('should throw an error if token issuance fails', async () => {
      const dto: IssueTokenDto = { deviceId: 'device-123' };
      const repositoryError = new Error('Repository error');
      authRepository.issueToken.mockRejectedValue(repositoryError);

      await expect(useCase.execute(dto)).rejects.toThrow('Validation error');
    });
  });
});
