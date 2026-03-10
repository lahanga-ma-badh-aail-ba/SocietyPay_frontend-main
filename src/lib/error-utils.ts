import { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
  error?: string;
}

export const getErrorMessage = (error: unknown, fallback = 'An error occurred'): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse;
    return data?.message || data?.error || error.message || fallback;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return fallback;
};