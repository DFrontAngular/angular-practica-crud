import {
  BadRequestException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { UploadedPracticeFile } from '../dto';
import {
  ALLOWED_DOCUMENT_FORMATS,
  ALLOWED_DOCUMENT_MIME_TYPES,
  CarDocumentFileValidationPipe,
  MAX_DOCUMENT_FILE_SIZE,
} from './car-document-file-validation.pipe';

describe('CarDocumentFileValidationPipe', () => {
  const pipe = new CarDocumentFileValidationPipe();

  const createFile = (
    overrides: Partial<UploadedPracticeFile> = {},
  ): UploadedPracticeFile =>
    ({
      fieldname: 'file',
      originalname: 'document.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      size: 1024,
      buffer: Buffer.from('test'),
      stream: undefined,
      destination: '',
      filename: '',
      path: '',
      ...overrides,
    }) as UploadedPracticeFile;

  it('accepts a supported file below the size limit', () => {
    const file = createFile();

    expect(pipe.transform(file)).toBe(file);
  });

  it('returns 400 when the file is missing', () => {
    try {
      pipe.transform(undefined);
      fail('Expected missing file validation to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        code: 'DOCUMENT_FILE_REQUIRED',
        message: 'A multipart file is required in the "file" field.',
      });
    }
  });

  it('returns 413 when the file is too large', () => {
    const file = createFile({ size: 5 * 1024 * 1024 + 1 });

    try {
      pipe.transform(file);
      fail('Expected file size validation to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(PayloadTooLargeException);
      expect((error as PayloadTooLargeException).getResponse()).toEqual({
        statusCode: 413,
        error: 'Payload Too Large',
        code: 'DOCUMENT_FILE_TOO_LARGE',
        message: 'The uploaded file exceeds the maximum allowed size of 5 MB.',
        details: {
          maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE,
        },
      });
    }
  });

  it('returns 415 when the MIME type is not supported', () => {
    const file = createFile({ mimetype: 'application/zip' });

    try {
      pipe.transform(file);
      fail('Expected MIME type validation to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(UnsupportedMediaTypeException);
      expect((error as UnsupportedMediaTypeException).getResponse()).toEqual({
        statusCode: 415,
        error: 'Unsupported Media Type',
        code: 'DOCUMENT_UNSUPPORTED_TYPE',
        message:
          'Unsupported file type "application/zip". Allowed formats: pdf, txt, doc, docx, png, jpg, jpeg.',
        details: {
          receivedMimeType: 'application/zip',
          allowedMimeTypes: ALLOWED_DOCUMENT_MIME_TYPES,
          allowedFormats: ALLOWED_DOCUMENT_FORMATS,
        },
      });
    }
  });
});
