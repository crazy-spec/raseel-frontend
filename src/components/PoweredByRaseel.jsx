import React from 'react';

function PoweredByRaseel() {
  return React.createElement('div', {
    style: {
      position: 'fixed',
      bottom: '0',
      right: '0',
      padding: '4px 12px',
      fontSize: '10px',
      color: '#9CA3AF',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderTopLeftRadius: '8px',
      zIndex: '50',
      borderTop: '1px solid #E5E7EB',
      borderLeft: '1px solid #E5E7EB',
      display: 'flex',
      gap: '6px',
      alignItems: 'center'
    }
  },
    'Powered by ',
    React.createElement('a', {
      href: '/landing',
      style: { color: '#6366F1', textDecoration: 'none', fontWeight: '600' }
    }, 'Raseel'),
    ' رسيل 🤖 | ',
    React.createElement('a', {
      href: '/privacy',
      style: { color: '#9CA3AF', textDecoration: 'none', fontSize: '9px' }
    }, 'Privacy'),
    ' | 🇸🇦'
  );
}

export default PoweredByRaseel;
