// Format Saudi Riyal
export function formatSAR(amount) {
  if (amount == null) return 'SAR 0.00';
  return 'SAR ' + Number(amount).toFixed(2);
}

// Format date nicely
export function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Status badge colors
export function getStatusColor(status) {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    granted: 'bg-green-100 text-green-800',
    revoked: 'bg-red-100 text-red-800',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
}

// Truncate text
export function truncate(str, len) {
  if (!str) return '';
  return str.length > (len || 50) ? str.substring(0, len || 50) + '...' : str;
}

// Calculate VAT (15%)
export function calculateVAT(amount) {
  return Number(amount) * 0.15;
}

export function withVAT(amount) {
  return Number(amount) * 1.15;
}
