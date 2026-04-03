import React from 'react';

function PrivacyPage() {
  return React.createElement('div', {
    style: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 24px',
      lineHeight: '1.7',
      color: '#1F2937'
    }
  },
    React.createElement('h1', {
      style: { fontSize: '28px', fontWeight: '700', marginBottom: '8px' }
    }, '🔒 Privacy Policy — Raseel رسيل'),

    React.createElement('p', {
      style: { color: '#6B7280', marginBottom: '32px' }
    }, 'Last updated: July 2025 | Saudi PDPL Compliant'),

    React.createElement('div', {
      dir: 'rtl',
      style: { backgroundColor: '#EEF2FF', padding: '16px', borderRadius: '8px', marginBottom: '24px' }
    },
      React.createElement('h3', { style: { marginBottom: '8px' } }, 'سياسة الخصوصية'),
      React.createElement('p', { style: { fontSize: '14px', color: '#4B5563' } },
        'نلتزم بحماية بياناتك الشخصية وفقاً لنظام حماية البيانات الشخصية في المملكة العربية السعودية.')
    ),

    React.createElement('h2', { style: { fontSize: '20px', marginTop: '24px', marginBottom: '12px' } }, '1. Data We Collect'),
    React.createElement('ul', { style: { paddingLeft: '24px' } },
      React.createElement('li', null, 'Name and phone number (WhatsApp communication)'),
      React.createElement('li', null, 'Order history and preferences'),
      React.createElement('li', null, 'Conversation messages (AI service improvement)'),
      React.createElement('li', null, 'Business information (business owners)')
    ),

    React.createElement('h2', { style: { fontSize: '20px', marginTop: '24px', marginBottom: '12px' } }, '2. How We Use Your Data'),
    React.createElement('ul', { style: { paddingLeft: '24px' } },
      React.createElement('li', null, 'Process orders and appointments'),
      React.createElement('li', null, 'AI-powered customer service via WhatsApp'),
      React.createElement('li', null, 'Improve AI responses and service quality'),
      React.createElement('li', null, 'Send order confirmations and updates')
    ),

    React.createElement('h2', { style: { fontSize: '20px', marginTop: '24px', marginBottom: '12px' } }, '3. Your Rights Under PDPL'),
    React.createElement('ul', { style: { paddingLeft: '24px' } },
      React.createElement('li', null, '✅ Access your personal data'),
      React.createElement('li', null, '✅ Correct inaccurate data'),
      React.createElement('li', null, '✅ Delete your data'),
      React.createElement('li', null, '✅ Withdraw consent'),
      React.createElement('li', null, '✅ Data portability'),
      React.createElement('li', null, '✅ Object to processing')
    ),

    React.createElement('h2', { style: { fontSize: '20px', marginTop: '24px', marginBottom: '12px' } }, '4. Data Protection'),
    React.createElement('ul', { style: { paddingLeft: '24px' } },
      React.createElement('li', null, 'We process data only with explicit consent'),
      React.createElement('li', null, 'We do not sell data to third parties'),
      React.createElement('li', null, 'Data stored securely with encryption'),
      React.createElement('li', null, 'Saudi Arabia jurisdiction')
    ),

    React.createElement('h2', { style: { fontSize: '20px', marginTop: '24px', marginBottom: '12px' } }, '5. Contact'),
    React.createElement('p', null, 'Privacy inquiries: privacy@raseel.sa'),

    React.createElement('div', {
      style: { marginTop: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '12px' }
    }, '© 2025 Raseel رسيل — Made in Saudi Arabia 🇸🇦')
  );
}

export default PrivacyPage;
