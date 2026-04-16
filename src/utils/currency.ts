/**
 * Utility to format prices in Algerian Dinar (DZD)
 * French: 12 500 DZD
 * Arabic: 12,500 دج
 */
export function formatPrice(price: number | string | null | undefined, locale: string): string {
  let amount = Number(price);
  
  // Hande NaN or invalid numbers
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }
  
  if (locale === 'ar') {
    // Arabic formatting: 12,500 دج
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('د.ج.', 'دج');
  }

  // French/Default formatting: 12 500 DZD
  const formattedAmount = new Intl.NumberFormat('fr-DZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return `${formattedAmount} DZD`;
}

