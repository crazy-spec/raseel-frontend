import api from './api';

var productService = {
  getAll: function (businessId) {
    return api.get('/products/?business_id=' + businessId);
  },
  getAvailable: function (businessId) {
    return api.get('/products/available?business_id=' + businessId);
  },
  create: function (businessId, data) {
    return api.post('/products/?business_id=' + businessId, data);
  },
  update: function (id, data) {
    return api.put('/products/' + id, data);
  },
  remove: function (id) {
    return api.delete('/products/' + id);
  },
};

export default productService;
