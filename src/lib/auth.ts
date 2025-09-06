import Cookies from 'js-cookie';
import { encryptUserData, decryptUserData } from './crypto';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface AuthenticatedUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}

const AUTH_COOKIE_NAME = 'dream_auth';
const COOKIE_EXPIRES_DAYS = 7;

export const saveAuthenticatedUser = (user: AuthenticatedUser): void => {
  const userData = JSON.stringify(user);
  // Use user ID + timestamp as encryption key base
  const userKey = `${user.id}_${Date.now()}`;
  const encryptedData = encryptUserData(userData, userKey);
  
  // Store both encrypted data and the key reference
  Cookies.set(AUTH_COOKIE_NAME, encryptedData, {
    expires: COOKIE_EXPIRES_DAYS,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: false // Client-side access needed for React
  });
  
  // Store the user key separately (this could be in sessionStorage for better security)
  Cookies.set(`${AUTH_COOKIE_NAME}_key`, userKey, {
    expires: COOKIE_EXPIRES_DAYS,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: false
  });
};

export const getAuthenticatedUser = (): AuthenticatedUser | null => {
  try {
    const encryptedData = Cookies.get(AUTH_COOKIE_NAME);
    const userKey = Cookies.get(`${AUTH_COOKIE_NAME}_key`);
    
    if (!encryptedData || !userKey) return null;
    
    const decryptedData = decryptUserData(encryptedData, userKey);
    return JSON.parse(decryptedData) as AuthenticatedUser;
  } catch (error) {
    console.error('Error retrieving authenticated user:', error);
    clearAuthenticatedUser();
    return null;
  }
};

export const clearAuthenticatedUser = (): void => {
  Cookies.remove(AUTH_COOKIE_NAME);
  Cookies.remove(`${AUTH_COOKIE_NAME}_key`);
};

export const isAuthenticated = (): boolean => {
  return getAuthenticatedUser() !== null;
};

// Telegram WebApp authentication validation
export const validateTelegramAuth = (telegramData: TelegramUser): boolean => {
  // Basic validation - in production, you should verify the hash with your bot token
  const requiredFields = ['id', 'first_name', 'auth_date', 'hash'];
  
  for (const field of requiredFields) {
    if (!(field in telegramData) || telegramData[field as keyof TelegramUser] === undefined) {
      return false;
    }
  }
  
  // Check if auth_date is not too old (within 24 hours)
  const currentTime = Math.floor(Date.now() / 1000);
  const maxAge = 24 * 60 * 60; // 24 hours in seconds
  
  if (currentTime - telegramData.auth_date > maxAge) {
    return false;
  }
  
  return true;
};

export const convertTelegramUser = (telegramUser: TelegramUser): AuthenticatedUser => {
  return {
    id: telegramUser.id,
    firstName: telegramUser.first_name,
    ...(telegramUser.last_name && { lastName: telegramUser.last_name }),
    ...(telegramUser.username && { username: telegramUser.username }),
    ...(telegramUser.photo_url && { photoUrl: telegramUser.photo_url })
  };
};