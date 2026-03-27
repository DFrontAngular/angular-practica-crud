import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { UploadedPracticeFile } from '../dto';

export const MAX_DOCUMENT_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
]);

@Injectable()
export class CarDocumentFileValidationPipe
  implements PipeTransform<UploadedPracticeFile | undefined, UploadedPracticeFile>
{
  transform(file: UploadedPracticeFile | undefined): UploadedPracticeFile {
    if (!file) {
      throw new BadRequestException(
        'A multipart file is required in the "file" field.',
      );
    }

    if (file.size > MAX_DOCUMENT_FILE_SIZE) {
      throw new PayloadTooLargeException(
        'The uploaded file exceeds the maximum allowed size of 5 MB.',
      );
    }

    if (!ALLOWED_DOCUMENT_MIME_TYPES.has(file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        `Unsupported file type "${file.mimetype}".`,
      );
    }

    return file;
  }
}
