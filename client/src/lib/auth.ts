import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  exp: number;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getCurrentUserId = (): string | null => {
  const token = getAuthToken();
  if (!token || !isTokenValid(token)) {
    return null;
  }
  
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.userId;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token !== null && isTokenValid(token);
};
