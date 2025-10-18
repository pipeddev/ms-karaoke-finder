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
    // Manejar casos de valores undefined/null
    if (value === undefined || value === null) {
      return false;
    }

    // Verificar que sea string
    if (typeof value !== 'string') {
      return false;
    }

    try {
      // Validar UUID y verificar versión
      return uuidValidate(value) && uuidVersion(value) === 4;
    } catch (error) {
      Logger.error('Error al validar UUIDv4:', error);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} debe ser un UUID versión 4 válido`;
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
