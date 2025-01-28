export const encodeNumberOrStringToBase64 = (
  numberOrString: number | string
): string => {
  return btoa(numberOrString.toString());
};

export const decodeBase64ToNumberOrString = (base64String: string): number => {
  return Number(atob(base64String));
};
