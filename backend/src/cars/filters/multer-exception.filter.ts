import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';
import {
  MAX_DOCUMENT_FILE_SIZE,
  MAX_DOCUMENT_FILE_SIZE_MB,
} from '../pipes/car-document-file-validation.pipe';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception.code === 'LIMIT_FILE_SIZE') {
      response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        error: 'Payload Too Large',
        code: 'DOCUMENT_FILE_TOO_LARGE',
        message: `The uploaded file exceeds the maximum allowed size of ${MAX_DOCUMENT_FILE_SIZE_MB} MB.`,
        details: {
          maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE,
        },
      });
      return;
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      code: 'DOCUMENT_UPLOAD_ERROR',
      message: exception.message,
    });
  }
}
