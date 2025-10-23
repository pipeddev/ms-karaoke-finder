import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/interface/auth.controller';
import { IssueTokenUseCase } from 'src/auth/application/use-cases/issue-token.usecase';
import { IssueTokenDto } from 'src/auth/interface/dto/issue-token.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let issueTokenUseCase: IssueTokenUseCase;

  const mockIssueTokenUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: IssueTokenUseCase,
          useValue: mockIssueTokenUseCase,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    issueTokenUseCase = module.get<IssueTokenUseCase>(IssueTokenUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('issueToken', () => {
    it('should call issueTokenUseCase.execute with the correct dto', async () => {
      const dto: IssueTokenDto = {
        deviceId: 'device-123',
      };
      const expectedResult = { token: 'mock-token' };

      mockIssueTokenUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.issueToken(dto);

      expect(issueTokenUseCase.execute).toHaveBeenCalledWith(dto);
      expect(issueTokenUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should return the result from issueTokenUseCase.execute', async () => {
      const dto: IssueTokenDto = { deviceId: 'device-123' };
      const mockToken = { token: 'jwt-token-123', expiresIn: 3600 };

      mockIssueTokenUseCase.execute.mockResolvedValue(mockToken);

      const result = await controller.issueToken(dto);

      expect(result).toEqual(mockToken);
    });

    it('should propagate errors from issueTokenUseCase.execute', async () => {
      const dto: IssueTokenDto = { deviceId: 'device-123' };
      const error = new Error('Invalid credentials');

      mockIssueTokenUseCase.execute.mockRejectedValue(error);

      await expect(controller.issueToken(dto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
