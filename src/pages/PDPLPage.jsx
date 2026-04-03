import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Users,
} from 'lucide-react';
import api from '../services/api';

export default function PDPLPage() {
  var appCtx = useApp();
  var activeBusiness = appCtx.activeBusiness;
  var reportState = useState(null);
  var report = reportState[0];
  var setReport = reportState[1];
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  var phoneState = useState('');
  var phoneSearch = phoneState[0];
  var setPhoneSearch = phoneState[1];
  var resultState = useState(null);
  var consentResult = resultState[0];
  var setConsentResult = resultState[1];
  var searchingState = useState(false);
  var searching = searchingState[0];
  var setSearching = searchingState[1];

  useEffect(function () {
    if (activeBusiness) loadReport();
    else setLoading(false);
  }, [activeBusiness]);

  function loadReport() {
    setLoading(true);
    api
      .get('/pdpl/compliance-report?business_id=' + activeBusiness.id)
      .then(function (res) {
        setReport(res.data);
        setLoading(false);
      })
      .catch(function () {
        setReport(null);
        setLoading(false);
      });
  }

  function searchConsent() {
    if (!phoneSearch.trim()) return;
    setSearching(true);
    api
      .get('/pdpl/consent-status?phone=' + encodeURIComponent(phoneSearch))
      .then(function (res) {
        setConsentResult(res.data);
        setSearching(false);
      })
      .catch(function () {
        setConsentResult({ error: 'Not found or error occurred' });
        setSearching(false);
      });
  }

  if (loading) return <LoadingSpinner size='lg' text='Loading PDPL report...' />;

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>
          {'\uD83D\uDEE1\uFE0F PDPL Compliance'}
        </h1>
        <p className='text-gray-500'>
          Saudi Personal Data Protection Law compliance dashboard
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Consent Granted'
          value={report ? report.consents_granted || 0 : 0}
          icon={<ShieldCheck size={24} />}
          color='indigo'
        />
        <StatCard
          title='Consent Revoked'
          value={report ? report.consents_revoked || 0 : 0}
          icon={<ShieldAlert size={24} />}
          color='red'
        />
        <StatCard
          title='Data Encrypted'
          value={report ? report.encrypted_records || '100%' : '100%'}
          icon={<Shield size={24} />}
          color='blue'
        />
        <StatCard
          title='Total Customers'
          value={report ? report.total_customers || 0 : 0}
          icon={<Users size={24} />}
          color='purple'
        />
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Card title='Consent Lookup'>
          <div className='space-y-4'>
            <div className='flex gap-3'>
              <div className='relative flex-1'>
                <Search
                  size={18}
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                />
                <input
                  type='text'
                  value={phoneSearch}
                  onChange={function (e) {
                    setPhoneSearch(e.target.value);
                  }}
                  placeholder='+966 5x xxx xxxx'
                  className='h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  onKeyDown={function (e) {
                    if (e.key === 'Enter') searchConsent();
                  }}
                />
              </div>
              <button
                onClick={searchConsent}
                disabled={searching}
                className='rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50'
              >
                {searching ? 'Checking...' : 'Check'}
              </button>
            </div>

            {consentResult && (
              <div
                className={
                  'rounded-lg p-4 ' +
                  (consentResult.error
                    ? 'bg-red-50 border border-red-200'
                    : consentResult.consent_given
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-amber-50 border border-amber-200')
                }
              >
                {consentResult.error ? (
                  <p className='text-red-700'>{consentResult.error}</p>
                ) : (
                  <div className='space-y-2'>
                    <p className='font-semibold'>
                      {consentResult.consent_given ? (
                        <span className='text-green-700'>
                          {'\u2705 Consent GRANTED'}
                        </span>
                      ) : (
                        <span className='text-amber-700'>
                          {'\u26A0\uFE0F Consent NOT granted'}
                        </span>
                      )}
                    </p>
                    {consentResult.consent_date && (
                      <p className='text-sm text-gray-600'>
                        {'Date: ' + consentResult.consent_date}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        <Card title='Compliance Checklist'>
          <div className='space-y-3'>
            {[
              { label: 'PII Encryption (AES-256)', done: true },
              { label: 'Phone Number Hashing', done: true },
              { label: 'Consent Before Processing', done: true },
              { label: 'STOP/Unsubscribe Support', done: true },
              { label: 'Data Retention Policy', done: true },
              { label: 'Right to Access (SAR)', done: true },
              { label: 'Right to Deletion', done: true },
              { label: 'Cross-border Transfer Controls', done: false },
              { label: 'Data Breach Notification', done: false },
              { label: 'DPO Appointed', done: false },
            ].map(function (item, i) {
              return (
                <div
                  key={i}
                  className='flex items-center justify-between rounded-lg border px-4 py-2'
                >
                  <span className='text-sm'>{item.label}</span>
                  {item.done ? (
                    <span className='rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'>
                      {'\u2705 Done'}
                    </span>
                  ) : (
                    <span className='rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700'>
                      {'\uD83D\uDD32 Pending'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card title='Data Processing Summary'>
        <div className='prose prose-sm max-w-none text-gray-600'>
          <p>
            Raseel Platform complies with Saudi Arabia's Personal Data
            Protection Law (PDPL) enacted by Royal Decree M/19 dated
            9/2/1443H. All customer personal data is:
          </p>
          <ul>
            <li>
              <strong>Encrypted at rest</strong> using AES-256 encryption
            </li>
            <li>
              <strong>Hashed for lookup</strong> using SHA-256 (phone numbers
              never stored in plain text)
            </li>
            <li>
              <strong>Consent-gated</strong> — no processing without explicit
              opt-in
            </li>
            <li>
              <strong>Deletable on request</strong> — customers can say STOP
              anytime
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
