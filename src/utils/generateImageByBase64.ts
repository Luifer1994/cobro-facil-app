/**
 * Generate image URL from various input types
 */
export const generateImageByBase64 = (input: string | null | File): string => {
  if (!input) {
    return "";
  }

  if (input instanceof File) {
    return URL.createObjectURL(input);
  }

  if (typeof input === 'string') {
    if (input.startsWith('data:image/')) {
      return input;
    }
    return `data:image/png;base64,${input}`;
  }

  return "";
};

/**
 * Convert base64 string to File object
 */
export const base64ToFile = (base64String: string): File => {
  // Extract the MIME type and base64 data
  const [header, base64Data] = base64String.split(',');
  const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/png';
  const extension = mimeType.split('/')[1];

  // Convert base64 to binary
  const binaryData = atob(base64Data);
  const byteArray = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    byteArray[i] = binaryData.charCodeAt(i);
  }

  // Create Blob and File
  const blob = new Blob([byteArray], { type: mimeType });
  return new File([blob], `logo.${extension}`, { type: mimeType });
};

/**
 * Validates and converts a Base64 string to a format suitable for <img src>.
 * If the Base64 string does not have the correct MIME type prefix, it adds it.
 *
 * @param base64String - The Base64 string to validate and convert.
 * @returns The validated Base64 string ready for use in <img src>.
 */
export const base64ToImage = (base64String: string): string => {
  // Check if the Base64 string already includes a valid data URL prefix
  if (base64String.startsWith("data:image/")) {
    return base64String; // Return as is if valid
  }

  // Assume it's a PNG if the MIME type is not specified
  const defaultMimeType = "image/png";

  // Return the Base64 string with the MIME type prefix
  return `data:${defaultMimeType};base64,${base64String}`;
};