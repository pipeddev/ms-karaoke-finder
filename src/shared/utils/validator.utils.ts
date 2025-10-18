import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { BaseDTO } from '../dtos/base.dto';
import { BusinessError, MessageErrorMap } from '../error/business.error';

@Injectable()
export class ValidatorUtils {
  async validateOrThrowBusinessError(object: BaseDTO): Promise<void> {
    const errors = await validate(object);
    if (errors.length === 0) {
      return;
    }

    const messageError: MessageErrorMap = {};

    errors.forEach((error) => {
      const field = error.property;
      const message = Object.values(error.constraints || {})
        .map((constraint) => {
          const regex = /\[(.*?)\]/;
          const match = regex.exec(constraint);

          const cleanMessage = match
            ? constraint.replace(regex, '').trim()
            : constraint;

          return cleanMessage;
        })
        .join('|');
      messageError[field] = message;
    });

    throw new BusinessError(messageError);
  }
}
