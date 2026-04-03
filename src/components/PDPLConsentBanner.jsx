import React from 'react';

function PDPLConsentBanner(props) {
  var onAccept = props.onAccept;
  var onDecline = props.onDecline;
  var isVisible = props.isVisible;

  if (!isVisible) return null;

  return React.createElement('div', {
    style: {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      backgroundColor: '#1F2937',
      color: 'white',
      padding: '16px 24px',
      zIndex: '9999',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }
  },
    React.createElement('div', { style: { flex: '1', minWidth: '250px' } },
      React.createElement('p', {
        style: { fontWeight: '600', marginBottom: '4px', fontSize: '14px' }
      }, '🔒 Privacy & Data Protection (PDPL)'),
      React.createElement('p', {
        style: { fontSize: '12px', color: '#D1D5DB', lineHeight: '1.4' }
      },
        'We process data per Saudi PDPL. ',
        React.createElement('a', {
          href: '/privacy',
          style: { color: '#818CF8', textDecoration: 'underline' }
        }, 'Privacy Policy')
      ),
      React.createElement('p', {
        dir: 'rtl',
        style: { fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }
      }, 'نعالج بياناتك وفقاً لنظام حماية البيانات الشخصية')
    ),
    React.createElement('div', {
      style: { display: 'flex', gap: '8px', flexShrink: '0' }
    },
      React.createElement('button', {
        onClick: onDecline,
        style: {
          padding: '8px 16px',
          backgroundColor: 'transparent',
          color: '#9CA3AF',
          border: '1px solid #4B5563',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px'
        }
      }, 'Decline'),
      React.createElement('button', {
        onClick: onAccept,
        style: {
          padding: '8px 20px',
          backgroundColor: '#6366F1',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600'
        }
      }, 'Accept \u2713 \u0645\u0648\u0627\u0641\u0642')
    )
  );
}

export default PDPLConsentBanner;
