import { BaseDTO } from 'src/shared/dtos/base.dto';
import { ToStringUtils } from 'src/shared/utils/to-string.util';

// Mock the ToStringUtils
jest.mock('src/shared/utils/to-string.util', () => ({
  ToStringUtils: {
    toString: jest.fn().mockReturnValue('mocked string'),
  },
}));

describe('BaseDTO', () => {
  // Create a concrete implementation of the abstract class for testing
  class TestDTO extends BaseDTO {
    public name: string;
    public age: number;

    constructor(name: string, age: number) {
      super();
      this.name = name;
      this.age = age;
    }
  }

  let testDto: TestDTO;

  beforeEach(() => {
    testDto = new TestDTO('John', 30);
    jest.clearAllMocks();
  });

  describe('toString', () => {
    it('should call ToStringUtils.toString with the instance', () => {
      const result = testDto.toString();

      expect(ToStringUtils.toString).toHaveBeenCalledWith(testDto);
      expect(result).toBe('mocked string');
    });

    it('should return the string representation of the object', () => {
      // Setup a specific implementation for this test
      (ToStringUtils.toString as jest.Mock).mockReturnValueOnce(
        JSON.stringify({ name: 'John', age: 30 }),
      );

      const result = testDto.toString();

      expect(result).toBe(JSON.stringify({ name: 'John', age: 30 }));
    });
  });
});
