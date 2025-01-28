
export interface FileWithPreview extends File {
  preview?: string;
}

export const base64ToFile = async (base64String: string, fileName: string = 'logo'): Promise<FileWithPreview> => {
  // Extract MIME type and base64 data
  const [header, data] = base64String.split(',');
  const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/png';
  const extension = mimeType.split('/')[1];

  // Convert base64 to blob
  const byteCharacters = atob(data);
  const byteArrays = new Uint8Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays[i] = byteCharacters.charCodeAt(i);
  }
  
  const blob = new Blob([byteArrays], { type: mimeType });
  const file = new File([blob], `${fileName}.${extension}`, { type: mimeType }) as FileWithPreview;
  file.preview = URL.createObjectURL(blob);
  
  return file;
};

export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

export const cleanupFilePreview = (previewUrl: string): void => {
  URL.revokeObjectURL(previewUrl);
};

export const isBase64Image = (str: string): boolean => {
  try {
    return str.startsWith('data:image/') && str.includes('base64,');
  } catch {
    return false;
  }
};