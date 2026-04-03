import api from './api';

const pdplService = {
  getConsentStatus: (phoneNumber) =>
    api.get('/pdpl/consent/' + encodeURIComponent(phoneNumber)),
  getComplianceReport: (businessId) =>
    api.get('/pdpl/compliance-report', {
      params: { business_id: businessId },
    }),
};

export default pdplService;
