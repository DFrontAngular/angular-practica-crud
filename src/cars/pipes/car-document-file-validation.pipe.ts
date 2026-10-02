import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { UploadedPracticeFile } from '../dto';

export const MAX_DOCUMENT_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_DOCUMENT_FILE_SIZE_MB = MAX_DOCUMENT_FILE_SIZE / (1024 * 1024);

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
];

export const ALLOWED_DOCUMENT_FORMATS = [
  'pdf',
  'txt',
  'doc',
  'docx',
  'png',
  'jpg',
  'jpeg',
];

const ALLOWED_DOCUMENT_MIME_TYPE_SET = new Set(ALLOWED_DOCUMENT_MIME_TYPES);
const ALLOWED_DOCUMENT_FORMATS_TEXT = ALLOWED_DOCUMENT_FORMATS.join(', ');

const buildMissingFileException = () =>
  new BadRequestException({
    statusCode: 400,
    error: 'Bad Request',
    code: 'DOCUMENT_FILE_REQUIRED',
    message: 'A multipart file is required in the "file" field.',
  });

const buildFileTooLargeException = () =>
  new PayloadTooLargeException({
    statusCode: 413,
    error: 'Payload Too Large',
    code: 'DOCUMENT_FILE_TOO_LARGE',
    message: `The uploaded file exceeds the maximum allowed size of ${MAX_DOCUMENT_FILE_SIZE_MB} MB.`,
    details: {
      maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE,
    },
  });

const buildUnsupportedFileTypeException = (receivedMimeType: string) =>
  new UnsupportedMediaTypeException({
    statusCode: 415,
    error: 'Unsupported Media Type',
    code: 'DOCUMENT_UNSUPPORTED_TYPE',
    message: `Unsupported file type "${receivedMimeType}". Allowed formats: ${ALLOWED_DOCUMENT_FORMATS_TEXT}.`,
    details: {
      receivedMimeType,
      allowedMimeTypes: ALLOWED_DOCUMENT_MIME_TYPES,
      allowedFormats: ALLOWED_DOCUMENT_FORMATS,
    },
  });

@Injectable()
export class CarDocumentFileValidationPipe
  implements PipeTransform<UploadedPracticeFile | undefined, UploadedPracticeFile>
{
  transform(file: UploadedPracticeFile | undefined): UploadedPracticeFile {
    if (!file) {
      throw buildMissingFileException();
    }

    if (file.size > MAX_DOCUMENT_FILE_SIZE) {
      throw buildFileTooLargeException();
    }

    if (!ALLOWED_DOCUMENT_MIME_TYPE_SET.has(file.mimetype)) {
      throw buildUnsupportedFileTypeException(file.mimetype);
    }

    return file;
  }
}
