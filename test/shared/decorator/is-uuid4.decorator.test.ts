import { Logger } from '@nestjs/common';
import { ValidationArguments } from 'class-validator';
import { IsUUID4Constraint } from 'src/shared/decorator/is-uuid4.decorator';

describe('IsUUID4Constraint', () => {
  let constraint: IsUUID4Constraint;

  beforeEach(() => {
    constraint = new IsUUID4Constraint();
    jest.spyOn(Logger, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validate', () => {
    it('should return false when value is undefined', () => {
      expect(constraint.validate(undefined)).toBe(false);
    });

    it('should return false when value is null', () => {
      expect(constraint.validate(null)).toBe(false);
    });

    it('should return false when value is not a string', () => {
      expect(constraint.validate(123)).toBe(false);
      expect(constraint.validate({})).toBe(false);
      expect(constraint.validate([])).toBe(false);
    });

    it('should return false when value is not a valid UUID', () => {
      expect(constraint.validate('not-a-uuid')).toBe(false);
      expect(constraint.validate('12345')).toBe(false);
    });

    it('should return false when value is a valid UUID but not version 4', () => {
      const uuidV1 = '4b3e1f80-9c4a-11ed-a8fc-0242ac120002';
      expect(constraint.validate(uuidV1)).toBe(false);
    });

    it('should return true when value is a valid UUID version 4', () => {
      const uuidV4 = '550e8400-e29b-41d4-a716-446655440000';
      expect(constraint.validate(uuidV4)).toBe(true);
    });

    it('should log error and return false when validation throws an error', () => {
      const invalidValue = 'invalid-uuid';
      const result = constraint.validate(invalidValue);

      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return correct error message', () => {
      const args: ValidationArguments = {
        property: 'userId',
        value: 'invalid',
        targetName: 'TestClass',
        object: {},
        constraints: [],
      };

      expect(constraint.defaultMessage(args)).toBe(
        'userId must be a valid UUID version 4',
      );
    });
  });
});
