import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import xss from 'xss';

export function IsSanitized(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSanitized',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && value === xss(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} contains unsafe content`;
        },
      },
    });
  };
}