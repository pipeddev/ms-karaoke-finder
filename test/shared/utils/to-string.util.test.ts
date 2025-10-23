/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ToStringUtils } from 'src/shared/utils/to-string.util';

describe('ToStringUtils', () => {
  describe('toString', () => {
    it('should handle null values', () => {
      expect(ToStringUtils.toString(null)).toBe('<null>');
    });

    it('should handle undefined values', () => {
      expect(ToStringUtils.toString(undefined)).toBe('<null>');
    });

    it('should format strings correctly', () => {
      expect(ToStringUtils.toString('test')).toBe('<string> test');
    });

    it('should format numbers correctly', () => {
      expect(ToStringUtils.toString(123)).toBe('<number> 123');
      expect(ToStringUtils.toString(0)).toBe('<number> 0');
      expect(ToStringUtils.toString(-10.5)).toBe('<number> -10.5');
    });

    it('should format booleans correctly', () => {
      expect(ToStringUtils.toString(true)).toBe('<boolean> true');
      expect(ToStringUtils.toString(false)).toBe('<boolean> false');
    });

    it('should format symbols correctly', () => {
      const symbol = Symbol('test');
      expect(ToStringUtils.toString(symbol)).toBe('<symbol> Symbol(test)');
    });

    it('should format bigint correctly', () => {
      const bigInt = BigInt('9007199254740991');
      expect(ToStringUtils.toString(bigInt)).toBe('<bigint> 9007199254740991');
    });

    it('should format simple objects correctly', () => {
      const obj = { name: 'John', age: 30 };
      expect(ToStringUtils.toString(obj)).toBe(
        'Object { name: John, age: 30 }',
      );
    });

    it('should format arrays correctly', () => {
      const arr = [1, 2, 3];
      expect(ToStringUtils.toString(arr)).toBe('Array { 0: 1, 1: 2, 2: 3 }');
    });

    it('should format custom classes correctly', () => {
      class Person {
        name: string;
        constructor(name: string) {
          this.name = name;
        }
      }
      const person = new Person('Alice');
      expect(ToStringUtils.toString(person)).toBe('Person { name: Alice }');
    });

    it('should format nested objects correctly', () => {
      const obj = { user: { name: 'John', age: 30 } };
      expect(ToStringUtils.toString(obj)).toBe(
        'Object { user: [object Object] }',
      );
    });

    it('should format empty objects correctly', () => {
      expect(ToStringUtils.toString({})).toBe('Object {  }');
    });
  });

  // Additional tests for the typeName logic
  describe('typeName determination', () => {
    it('should handle objects with null prototype', () => {
      const nullProtoObj = Object.create(null);

      nullProtoObj.test = 'value';
      expect(ToStringUtils.toString(nullProtoObj)).toBe(
        'Object { test: value }',
      );
    });

    it('should handle objects with modified constructor name', () => {
      const obj = {};
      Object.defineProperty(Object.getPrototypeOf(obj).constructor, 'name', {
        value: 'CustomType',
        configurable: true,
      });
      expect(ToStringUtils.toString(obj)).toBe('CustomType {  }');
    });

    it('should handle objects with constructor but no name property', () => {
      const obj = {};
      const originalName = Object.getPrototypeOf(obj).constructor.name;
      Object.defineProperty(Object.getPrototypeOf(obj).constructor, 'name', {
        value: undefined,
        configurable: true,
      });
      expect(ToStringUtils.toString(obj)).toBe('Object {  }');
      // Restore original name
      Object.defineProperty(Object.getPrototypeOf(obj).constructor, 'name', {
        value: originalName,
        configurable: true,
      });
    });

    it('should handle objects with prototype but no constructor', () => {
      const protoWithoutConstructor = {};
      Object.setPrototypeOf(protoWithoutConstructor, null);

      const obj = Object.create(protoWithoutConstructor);

      obj.test = 'value';

      expect(ToStringUtils.toString(obj)).toBe('Object { test: value }');
    });
  });
});
