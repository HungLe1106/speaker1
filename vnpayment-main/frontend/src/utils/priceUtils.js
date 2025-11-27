/**
 * Format price to Vietnamese Dong (VND)
 * @param {number} price - Price in VND
 * @param {boolean} showCurrency - Show currency symbol (default: true)
 * @returns {string} Formatted price string
 * 
 * Examples:
 * formatVND(1500000) => "1.500.000 ₫"
 * formatVND(999000) => "999.000 ₫"
 * formatVND(50000, false) => "50.000"
 */
export function formatVND(price, showCurrency = true) {
  if (typeof price !== 'number' || isNaN(price)) {
    return showCurrency ? '0 ₫' : '0';
  }

  // Format with thousands separator (dot for VND)
  const formatted = Math.round(price).toLocaleString('vi-VN');
  
  return showCurrency ? `${formatted} ₫` : formatted;
}

/**
 * Calculate discounted price
 * @param {number} price - Original price
 * @param {number} discount - Discount percentage (0-100)
 * @returns {number} Final price after discount
 */
export function calculateDiscountPrice(price, discount) {
  if (!discount || discount <= 0) {
    return price;
  }
  return Math.round(price * (1 - discount / 100));
}

/**
 * Format discount percentage
 * @param {number} discount - Discount percentage (0-100)
 * @returns {string} Formatted discount string
 * 
 * Example: formatDiscount(23) => "-23%"
 */
export function formatDiscount(discount) {
  if (!discount || discount <= 0) {
    return '';
  }
  return `-${Math.round(discount)}%`;
}

/**
 * Get discount badge style
 * @param {number} discount - Discount percentage (0-100)
 * @returns {object} CSS style object for discount badge
 */
export function getDiscountBadgeStyle(discount) {
  if (!discount || discount <= 0) {
    return null;
  }

  return {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'linear-gradient(135deg, #ff3e3e 0%, #ff1744 100%)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(255, 30, 68, 0.4)',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    animation: 'pulse 2s ease-in-out infinite'
  };
}
