import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import ComingSoonState from '../components/ui/ComingSoonState';
import api from '../services/api';
import { Search, Users } from 'lucide-react';

export default function CustomersPage() {
  var appContext = useApp();
  var business = appContext.activeBusiness;
  var customersState = useState([]);
  var customers = customersState[0];
  var setCustomers = customersState[1];
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  var searchState = useState('');
  var search = searchState[0];
  var setSearch = searchState[1];

  useEffect(function () {
    if (business && business.id) {
      setLoading(true);
      api
        .get('/customers/' + business.id)
        .then(function (res) {
          setCustomers(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        })
        .catch(function () {
          setCustomers([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [business ? business.id : null]);

  if (!business) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center text-gray-500'>
          <p className='text-4xl mb-3'>{'\uD83D\uDC65'}</p>
          <p className='font-medium'>Select a business from the header</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='text-center py-20'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto'></div>
        <p className='text-gray-500 mt-3'>Loading customers...</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {'\uD83D\uDC65 Customers'}
          </h1>
          <p className='text-gray-500'>
            {(business.displayName || business.name_en || '') + ' \u2014 Customer Database'}
          </p>
        </div>
        <ComingSoonState
          icon={'\uD83D\uDC65'}
          title='Customers appear after WhatsApp conversations'
          description='When customers message your business via WhatsApp, they are automatically added here with their consent status, conversation history, and preferences.'
          requiredStep='Connect WhatsApp and receive your first message'
        />
      </div>
    );
  }

  var filtered = customers.filter(function (c) {
    var s = search.toLowerCase();
    return (
      (c.name || '').toLowerCase().indexOf(s) >= 0 ||
      (c.phone || '').indexOf(s) >= 0
    );
  });

  var getInitials = function (name) {
    if (!name || name === 'Unknown') return '?';
    return name
      .split(' ')
      .map(function (w) {
        return w[0];
      })
      .join('')
      .slice(0, 2);
  };

  var colors = [
    'bg-indigo-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-amber-500',
    'bg-teal-500',
    'bg-rose-500',
    'bg-cyan-500',
  ];
  var getColor = function (name) {
    return colors[(name || '').length % colors.length];
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {'\uD83D\uDC65 Customers'}
          </h1>
          <p className='text-gray-500 mt-1'>
            {(business.displayName || business.name_en || '') +
              ' \u2014 ' +
              customers.length +
              ' customers'}
          </p>
        </div>
        <div className='relative w-full sm:w-64'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <input
            type='text'
            placeholder='Search by name or phone...'
            value={search}
            onChange={function (e) {
              setSearch(e.target.value);
            }}
            className='w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='bg-white p-4 rounded-xl shadow-sm border'>
          <p className='text-sm text-gray-500'>Total Customers</p>
          <p className='text-2xl font-bold text-indigo-600'>{customers.length}</p>
        </div>
        <div className='bg-white p-4 rounded-xl shadow-sm border'>
          <p className='text-sm text-gray-500'>With Consent</p>
          <p className='text-2xl font-bold text-green-600'>
            {customers.filter(function (c) {
              return c.consent_given;
            }).length}
          </p>
        </div>
        <div className='bg-white p-4 rounded-xl shadow-sm border'>
          <p className='text-sm text-gray-500'>With Names</p>
          <p className='text-2xl font-bold text-purple-600'>
            {customers.filter(function (c) {
              return c.name && c.name !== 'Unknown';
            }).length}
          </p>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-sm border overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                Customer
              </th>
              <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                Phone
              </th>
              <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                Joined
              </th>
              <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                Consent
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {filtered.map(function (c) {
              return (
                <tr key={c.id} className='hover:bg-gray-50 transition'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={
                          'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ' +
                          getColor(c.name)
                        }
                      >
                        {getInitials(c.name)}
                      </div>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {c.name || 'Unknown'}
                        </p>
                        <p className='text-xs text-gray-400'>
                          {'ID: ' + String(c.id).slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-gray-600 font-mono'>
                    {'**** ' + (c.phone || '').slice(-4)}
                  </td>
                  <td className='px-6 py-4 text-gray-500 text-sm'>
                    {c.created_at
                      ? new Date(c.created_at).toLocaleDateString('en-SA')
                      : '\u2014'}
                  </td>
                  <td className='px-6 py-4'>
                    {c.consent_given ? (
                      <span className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'>
                        {'\u2705 Granted'}
                      </span>
                    ) : (
                      <span className='px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium'>
                        {'\u23F3 Pending'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
