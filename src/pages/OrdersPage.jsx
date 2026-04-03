import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';

function parseItems(items) {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  if (typeof items === 'string') {
    try {
      var parsed = JSON.parse(items);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch (e) {
      return [];
    }
  }
  return [];
}

var STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  delivered: 'bg-indigo-100 text-indigo-800',
  cancelled: 'bg-red-100 text-red-800',
};

var STATUS_ICONS = {
  pending: '\u23F3',
  confirmed: '\u2705',
  preparing: '\uD83D\uDC68\u200D\uD83C\uDF73',
  completed: '\u2705',
  delivered: '\uD83D\uDE9A',
  cancelled: '\u274C',
};

export default function OrdersPage() {
  var appContext = useApp();
  var business = appContext.activeBusiness;
  var ordersState = useState([]);
  var orders = ordersState[0];
  var setOrders = ordersState[1];
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  var filterState = useState('all');
  var filter = filterState[0];
  var setFilter = filterState[1];

  useEffect(function () {
    if (business && business.id) {
      setLoading(true);
      api
        .get('/orders/' + business.id)
        .then(function (res) {
          setOrders(res.data && res.data.length > 0 ? res.data : []);
          setLoading(false);
        })
        .catch(function () {
          setOrders([]);
          setLoading(false);
        });
    }
  }, [business ? business.id : null]);

  if (!business) {
    return (
      <div className='flex items-center justify-center h-96'>
        <p className='text-gray-500 text-lg'>
          Select a business from the header to view orders
        </p>
      </div>
    );
  }

  var filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter(function (o) {
          return o.status === filter;
        });
  var totalRevenue = orders.reduce(function (sum, o) {
    return sum + (o.total || 0);
  }, 0);
  var pendingCount = orders.filter(function (o) {
    return o.status === 'pending' || o.status === 'confirmed';
  }).length;
  var completedCount = orders.filter(function (o) {
    return o.status === 'completed' || o.status === 'delivered';
  }).length;

  if (loading) {
    return (
      <div className='text-center py-20'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto'></div>
        <p className='text-gray-500 mt-3'>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>
          {'\uD83D\uDCE6 Orders'}
        </h1>
        <p className='text-gray-500 mt-1'>
          {(business.displayName || business.name_en || business.name_ar) +
            ' \u2014 Order Management'}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white rounded-xl shadow-sm border p-4 text-center'>
          <p className='text-2xl font-bold text-gray-900'>{orders.length}</p>
          <p className='text-sm text-gray-500'>Total Orders</p>
        </div>
        <div className='bg-white rounded-xl shadow-sm border p-4 text-center'>
          <p className='text-2xl font-bold text-indigo-600'>
            {totalRevenue.toFixed(0) + ' SAR'}
          </p>
          <p className='text-sm text-gray-500'>Total Revenue</p>
        </div>
        <div className='bg-white rounded-xl shadow-sm border p-4 text-center'>
          <p className='text-2xl font-bold text-yellow-600'>{pendingCount}</p>
          <p className='text-sm text-gray-500'>Pending</p>
        </div>
        <div className='bg-white rounded-xl shadow-sm border p-4 text-center'>
          <p className='text-2xl font-bold text-green-600'>{completedCount}</p>
          <p className='text-sm text-gray-500'>Completed</p>
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        {['all', 'pending', 'confirmed', 'preparing', 'completed', 'delivered', 'cancelled'].map(
          function (s) {
            var count =
              s === 'all'
                ? orders.length
                : orders.filter(function (o) {
                    return o.status === s;
                  }).length;
            return (
              <button
                key={s}
                onClick={function () {
                  setFilter(s);
                }}
                className={
                  'px-4 py-2 rounded-lg text-sm font-medium transition ' +
                  (filter === s
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-gray-600 border hover:bg-gray-50')
                }
              >
                {(STATUS_ICONS[s] || '\uD83D\uDCCB') +
                  ' ' +
                  s.charAt(0).toUpperCase() +
                  s.slice(1) +
                  ' (' +
                  count +
                  ')'}
              </button>
            );
          }
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className='text-center py-12 bg-white rounded-xl border'>
          <p className='text-4xl mb-3'>{'\uD83D\uDCE6'}</p>
          <p className='text-gray-500'>
            {filter === 'all' ? 'No orders yet' : 'No ' + filter + ' orders'}
          </p>
          <p className='text-sm text-gray-400 mt-1'>
            Orders will appear here when customers place them via WhatsApp
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {filteredOrders.map(function (order) {
            var items = parseItems(order.items);
            var orderNum = order.order_number || order.id;
            var customerName =
              order.customer_name || order.notes || 'Customer';
            if (
              customerName &&
              customerName.indexOf('Demo order from ') === 0
            ) {
              customerName = customerName.replace('Demo order from ', '');
            }
            return (
              <div
                key={order.id}
                className='bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <span className='font-mono text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded'>
                        {orderNum}
                      </span>
                      <span
                        className={
                          'px-2 py-0.5 rounded-full text-xs font-medium ' +
                          (STATUS_COLORS[order.status] ||
                            'bg-gray-100 text-gray-800')
                        }
                      >
                        {(STATUS_ICONS[order.status] || '') +
                          ' ' +
                          (order.status || 'unknown')}
                      </span>
                    </div>
                    <p className='font-medium text-gray-900 mb-1'>
                      {'\uD83D\uDC64 ' + customerName}
                    </p>
                    <div className='text-sm text-gray-500'>
                      {items.length > 0
                        ? items.map(function (item, i) {
                            var itemName =
                              item.name ||
                              item.name_en ||
                              item.name_ar ||
                              'Item';
                            var itemQty = item.qty || item.quantity || 1;
                            return (
                              <span key={i}>
                                {itemName + ' x' + itemQty}
                                {i < items.length - 1 ? ' \u2022 ' : ''}
                              </span>
                            );
                          })
                        : 'Order items'}
                    </div>
                  </div>
                  <div className='text-right ml-4'>
                    <p className='text-lg font-bold text-gray-900'>
                      {(order.total || 0).toFixed(2) + ' SAR'}
                    </p>
                    {order.vat_amount ? (
                      <p className='text-xs text-gray-400'>
                        {'VAT: ' + order.vat_amount.toFixed(2) + ' SAR'}
                      </p>
                    ) : null}
                    <p className='text-xs text-gray-400 mt-1'>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString(
                            'en-SA',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )
                        : '\u2014'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
