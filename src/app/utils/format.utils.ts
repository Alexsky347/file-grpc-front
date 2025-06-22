/**
 * Formats a file size in bytes to a human-readable string format
 *
 * @param bytes The file size in bytes
 * @returns A formatted string representation (e.g., "5.25 MB")
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Formats a date string to the local date string
 *
 * @param dateString The date string to format
 * @returns A formatted date string using the user's locale
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}
