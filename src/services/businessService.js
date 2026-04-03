import api from './api';

const businessService = {
  getAll: () => api.get('/businesses/'),
  getById: (id) => api.get('/businesses/' + id),
  create: (data) => api.post('/businesses/', data),
  update: (id, data) => api.put('/businesses/' + id, data),
  delete: (id) => api.delete('/businesses/' + id),
  getByAccessCode: (code) => api.get('/businesses/access-code/' + code),
};

export default businessService;
