import { Logger } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

@ValidatorConstraint({ name: 'isUUID4', async: false })
export class IsUUID4Constraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (value === undefined || value === null) {
      return false;
    }

    if (typeof value !== 'string') {
      return false;
    }

    try {
      return uuidValidate(value) && uuidVersion(value) === 4;
    } catch (error) {
      Logger.error(`Error to validate UUIDv4 for value "${value}":`, error);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid UUID version 4`;
  }
}

export function IsUUID4(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUUID4',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUUID4Constraint,
    });
  };
}
