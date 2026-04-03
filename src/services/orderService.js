import api from './api';

const orderService = {
  getAll: (businessId) => api.get('/orders/' + businessId),
  create: (data) => api.post('/orders/', data),
  updateStatus: (id, status) => api.put('/orders/' + id + '/status', { status: status }),
};

export default orderService;
