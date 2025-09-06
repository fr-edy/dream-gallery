import CryptoJS from 'crypto-js';

// Client-side encryption using a derivation of user session
export const encryptUserData = (data: string, userKey: string): string => {
  // Create a key from user-specific data + a static salt
  const derivedKey = CryptoJS.PBKDF2(userKey, 'dream-gallery-salt', {
    keySize: 256/32,
    iterations: 1000
  });
  return CryptoJS.AES.encrypt(data, derivedKey.toString()).toString();
};

export const decryptUserData = (encryptedData: string, userKey: string): string => {
  const derivedKey = CryptoJS.PBKDF2(userKey, 'dream-gallery-salt', {
    keySize: 256/32,
    iterations: 1000
  });
  const bytes = CryptoJS.AES.decrypt(encryptedData, derivedKey.toString());
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const generateRandomKey = (): string => {
  return CryptoJS.lib.WordArray.random(32).toString();
};