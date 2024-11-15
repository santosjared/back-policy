import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class IsFileTypeConstraint implements ValidatorConstraintInterface {
    validate(file: Express.Multer.File, args: ValidationArguments) {
      const allowedTypes = args.constraints[0] as string[];
      if (!file) return false; 
      console.log(file)
      return allowedTypes.includes(file.mimetype);
    }
  
    defaultMessage(args: ValidationArguments) {
      const allowedTypes = args.constraints[0] as string[];
      return `File type is invalid. Allowed types: ${allowedTypes.join(', ')}`;
    }
  }
  