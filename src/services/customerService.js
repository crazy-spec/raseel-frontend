import api from './api';

const customerService = {
  getAll: (businessId) =>
    api.get('/customers/', { params: { business_id: businessId } }),
  getById: (id) => api.get('/customers/' + id),
  getConversations: (customerId) =>
    api.get('/customers/' + customerId + '/conversations'),
};

export default customerService;
