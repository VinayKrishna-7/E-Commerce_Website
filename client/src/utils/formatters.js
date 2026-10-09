export const formatCurrency = (amount) => {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (isNaN(numeric)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateDiscount = (price, originalPrice) => {
  if (!originalPrice || Number(originalPrice) <= Number(price)) return null;
  const p = Number(price);
  const orig = Number(originalPrice);
  const diff = Math.round(((orig - p) / orig) * 100);
  return diff > 0 ? `-${diff}%` : null;
};

export const truncate = (str, len = 80) => {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.slice(0, len) + '…';
};

export const getOrderStatusBadge = (status) => {
  switch (status?.toUpperCase()) {
    case 'DELIVERED':
      return { label: 'Delivered', className: 'badge-success' };
    case 'SHIPPED':
      return { label: 'Shipped', className: 'badge-info' };
    case 'PROCESSING':
      return { label: 'Processing', className: 'badge-warning' };
    case 'CANCELLED':
      return { label: 'Cancelled', className: 'badge-error' };
    case 'PENDING':
    default:
      return { label: 'Pending', className: 'badge-category' };
  }
};
