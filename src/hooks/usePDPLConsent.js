import { useState } from 'react';

function usePDPLConsent() {
  var STORAGE_KEY = 'raseel_pdpl_consent';
  var stored = localStorage.getItem(STORAGE_KEY);
  var initialState = stored ? JSON.parse(stored) : null;

  var consentResult = useState(initialState);
  var consent = consentResult[0];
  var setConsent = consentResult[1];

  var bannerResult = useState(!initialState);
  var showBanner = bannerResult[0];
  var setShowBanner = bannerResult[1];

  function acceptConsent() {
    var record = {
      accepted: true,
      timestamp: new Date().toISOString(),
      version: '1.0',
      jurisdiction: 'SA-PDPL'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    setConsent(record);
    setShowBanner(false);
  }

  function declineConsent() {
    var record = {
      accepted: false,
      timestamp: new Date().toISOString(),
      version: '1.0',
      jurisdiction: 'SA-PDPL'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    setConsent(record);
    setShowBanner(false);
  }

  function revokeConsent() {
    localStorage.removeItem(STORAGE_KEY);
    setConsent(null);
    setShowBanner(true);
  }

  return {
    consent: consent,
    showBanner: showBanner,
    acceptConsent: acceptConsent,
    declineConsent: declineConsent,
    revokeConsent: revokeConsent,
    hasConsented: consent && consent.accepted === true
  };
}

export default usePDPLConsent;
