import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';
import { BaseDTO } from '../../../src/shared/dtos/base.dto';
import { BusinessError } from '../../../src/shared/error/business.error';
import { ValidatorUtils } from '../../../src/shared/utils/validator.utils';
import { IsString } from 'class-validator';

// Mock class-validator
jest.mock('class-validator', () => ({
  validate: jest.fn(),
  IsString: () => () => {},
  IsNotEmpty: () => () => {},
}));

describe('ValidatorUtils', () => {
  let validatorUtils: ValidatorUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidatorUtils],
    }).compile();

    validatorUtils = module.get<ValidatorUtils>(ValidatorUtils);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  class TestDTO extends BaseDTO {
    @IsString()
    name: string;
  }

  it('should be defined', () => {
    expect(validatorUtils).toBeDefined();
  });

  it('should not throw error when validation passes', async () => {
    // Mock validate to return empty array (no errors)
    (validate as jest.Mock).mockResolvedValue([]);

    const dto = new TestDTO();
    await expect(
      validatorUtils.validateOrThrowBusinessError(dto),
    ).resolves.not.toThrow();
  });

  it('should throw BusinessError with mapped messages when validation fails', async () => {
    // Mock validation errors
    (validate as jest.Mock).mockResolvedValue([
      {
        property: 'name',
        constraints: {
          isString: 'name must be a string',
        },
      },
    ]);

    const dto = new TestDTO();

    await expect(
      validatorUtils.validateOrThrowBusinessError(dto),
    ).rejects.toThrow(BusinessError);

    await expect(
      validatorUtils.validateOrThrowBusinessError(dto),
    ).rejects.toMatchObject({
      messages: {
        name: 'name must be a string',
      },
    });
  });

  it('should clean error messages that contain brackets', async () => {
    // Mock validation errors with bracketed content
    (validate as jest.Mock).mockResolvedValue([
      {
        property: 'name',
        constraints: {
          isString: 'name [some extra info] must be a string',
        },
      },
    ]);

    const dto = new TestDTO();

    await expect(
      validatorUtils.validateOrThrowBusinessError(dto),
    ).rejects.toMatchObject({
      messages: {
        name: 'name  must be a string',
      },
    });
  });

  it('should join multiple error messages with pipe separator', async () => {
    // Mock multiple validation errors for one property
    (validate as jest.Mock).mockResolvedValue([
      {
        property: 'name',
        constraints: {
          isString: 'name must be a string',
          isNotEmpty: 'name should not be empty',
        },
      },
    ]);

    const dto = new TestDTO();

    await expect(
      validatorUtils.validateOrThrowBusinessError(dto),
    ).rejects.toMatchObject({
      messages: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        name: expect.stringContaining('|'),
      },
    });
  });

  it('should handle multiple fields with errors', async () => {
    // Mock errors for multiple properties
    (validate as jest.Mock).mockResolvedValue([
      {
        property: 'name',
        constraints: {
          isString: 'name must be a string',
        },
      },
      {
        property: 'age',
        constraints: {
          isNumber: 'age must be a number',
        },
      },
    ]);

    const dto = new TestDTO();

    await expect(
      validatorUtils.validateOrThrowBusinessError(dto),
    ).rejects.toMatchObject({
      messages: {
        name: 'name must be a string',
        age: 'age must be a number',
      },
    });
  });
});
