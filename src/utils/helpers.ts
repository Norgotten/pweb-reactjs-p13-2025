// src/utils/helpers.ts - COMPLETE & FIXED

/**
 * Format currency to USD
 */
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue / 10000);
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Get price from backend format (string) to number
 */
export const getPriceAsNumber = (priceString: string): number => {
  if (!priceString) return 0;
  const parsed = parseFloat(priceString);
  return isNaN(parsed) ? 0 : parsed / 10000;
};

/**
 * Format stock status with color and text
 */
export const getStockStatus = (stock: number): { text: string; color: string } => {
  if (stock === 0) {
    return { text: 'Out of Stock', color: 'text-red-600' };
  }
  if (stock < 10) {
    return { text: 'Low Stock', color: 'text-yellow-600' };
  }
  return { text: 'In Stock', color: 'text-green-600' };
};

/**
 * Sleep utility for async operations
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Format number with thousand separator
 */
export const formatNumber = (num: number): string => {
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Check if object is empty
 */
export const isEmptyObject = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Safe JSON parse
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};