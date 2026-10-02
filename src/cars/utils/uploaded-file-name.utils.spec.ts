import { normalizeUploadedFileName } from './uploaded-file-name.utils';

describe('normalizeUploadedFileName', () => {
  it('keeps ASCII file names untouched', () => {
    expect(normalizeUploadedFileName('document.pdf')).toBe('document.pdf');
  });

  it('fixes mojibake produced by latin1-decoded utf8 file names', () => {
    expect(normalizeUploadedFileName('ficha tÃ©cnica - aÃ±o 2026.pdf')).toBe(
      'ficha técnica - año 2026.pdf',
    );
  });
});
