import { ToStringUtils } from '../utils/to-string.util';

export abstract class BaseDTO {
  toString(): string {
    return ToStringUtils.toString(this);
  }
}
