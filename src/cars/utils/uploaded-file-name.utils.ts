const MOJIBAKE_FILE_NAME_PATTERN = /[ÃÂâÐÑ]/;

export function normalizeUploadedFileName(originalName: string): string {
  if (!MOJIBAKE_FILE_NAME_PATTERN.test(originalName)) {
    return originalName;
  }

  const normalizedName = Buffer.from(originalName, 'latin1').toString('utf8');

  return normalizedName.includes('\uFFFD') ? originalName : normalizedName;
}
