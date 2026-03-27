import {
  BadRequestException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { UploadedPracticeFile } from '../dto';
import { CarDocumentFileValidationPipe } from './car-document-file-validation.pipe';

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
    expect(() => pipe.transform(undefined)).toThrow(BadRequestException);
  });

  it('returns 413 when the file is too large', () => {
    const file = createFile({ size: 5 * 1024 * 1024 + 1 });

    expect(() => pipe.transform(file)).toThrow(PayloadTooLargeException);
  });

  it('returns 415 when the MIME type is not supported', () => {
    const file = createFile({ mimetype: 'application/zip' });

    expect(() => pipe.transform(file)).toThrow(
      UnsupportedMediaTypeException,
    );
  });
});

