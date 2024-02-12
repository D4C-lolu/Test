import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    const errorResponse = {
      statusCode: 400,
      message: 'Validation failed',
      errors: this.buildErrorMessages(exception),
    };

    response.status(400).json(errorResponse);
  }

  private buildErrorMessages(errors: ValidationError): Record<string, string> {
    const result: Record<string, string> = {};
    errors.children.forEach((error) => {
      Object.keys(error.constraints).forEach((key) => {
        result[error.property] = error.constraints[key];
      });
    });
    return result;
  }
}
