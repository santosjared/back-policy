import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsFileTypeConstraint } from '../validator/file';

export function IsFile(allowedTypes: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [allowedTypes],
        validator: IsFileTypeConstraint,
      });
    };
  }
  