import api from './api';

const analyticsService = {
  getDashboard: (businessId) => api.get('/analytics/dashboard/' + businessId),
  getPlatformStats: () => api.get('/analytics/platform-stats'),
};

export default analyticsService;
