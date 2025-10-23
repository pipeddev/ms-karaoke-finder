import { JSendDTO } from 'src/shared/dtos/jsend.dto';

describe('JSendDTO', () => {
  describe('success', () => {
    it('should create a success response with data', () => {
      const testData = { foo: 'bar' };
      const result = JSendDTO.success(testData);

      expect(result).toEqual({
        status: 'success',
        data: testData,
      });
    });

    it('should create a success response with array data', () => {
      const testData = [1, 2, 3];
      const result = JSendDTO.success(testData);

      expect(result).toEqual({
        status: 'success',
        data: testData,
      });
    });
  });

  describe('fail', () => {
    it('should create a fail response with error data', () => {
      const errorData = { message: 'Validation error', field: 'email' };
      const result = JSendDTO.fail(errorData);

      expect(result).toEqual({
        status: 'fail',
        data: errorData,
      });
    });

    it('should create a fail response with string error', () => {
      const errorMessage = 'Something went wrong';
      const result = JSendDTO.fail(errorMessage);

      expect(result).toEqual({
        status: 'fail',
        data: errorMessage,
      });
    });
  });

  describe('error', () => {
    it('should create an error response with formatted message', () => {
      const errorMessage = 'Internal server error';
      const result = JSendDTO.error(errorMessage);

      expect(result).toEqual({
        status: 'error',
        message: `Consulte a soporte por error: ${errorMessage}`,
      });
    });
  });
});
