import React from 'react';
import PDPLConsentBanner from './PDPLConsentBanner';
import PoweredByRaseel from './PoweredByRaseel';
import usePDPLConsent from '../hooks/usePDPLConsent';

function AppWrapper(props) {
  var pdpl = usePDPLConsent();

  return React.createElement(React.Fragment, null,
    props.children,
    React.createElement(PDPLConsentBanner, {
      isVisible: pdpl.showBanner,
      onAccept: pdpl.acceptConsent,
      onDecline: pdpl.declineConsent
    }),
    React.createElement(PoweredByRaseel, null)
  );
}

export default AppWrapper;
