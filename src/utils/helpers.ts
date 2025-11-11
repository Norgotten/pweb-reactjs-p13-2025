// src/utils/helpers.ts - MINIMAL VERSION (Only Used Functions)

/**
 * Format currency to USD
 * Used in: BookCard, BookDetailsPage, TransactionPage, TransactionDetailPage, TransactionHistoryPage
 */
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '$0.00';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue / 10000);
};

/**
 * Truncate text with ellipsis
 * Used in: BookCard
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format stock status with color and text
 * Used in: BookCard
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
 * Get price from backend format (string) to number
 * Used in: TransactionPage
 */
export const getPriceAsNumber = (priceString: string): number => {
  if (!priceString) return 0;
  const parsed = parseFloat(priceString);
  return isNaN(parsed) ? 0 : parsed / 10000;
};

/**
 * Format date to readable format
 * Used in: TransactionDetailPage, TransactionHistoryPage
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