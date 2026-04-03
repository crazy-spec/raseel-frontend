import api from './api';

const agentService = {
  sendMessage: (messageText, businessId, customerPhone) =>
    api.post('/conversations/process', {
      message_text: messageText,
      business_id: String(businessId),
      customer_phone: customerPhone || '+966500000000',
      message_language: 'auto',
    }),

  getStats: (businessId) =>
    api.get('/conversations/stats/' + businessId),
};

export default agentService;
