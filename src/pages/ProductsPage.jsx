import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { formatSAR } from '../utils/helpers';
import { Package, Search, Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react';
import productService from '../services/productService';

var EMPTY_FORM = {
  name_en: '',
  name_ar: '',
  description_en: '',
  description_ar: '',
  category: '',
  price: '',
  is_available: true,
};

export default function ProductsPage() {
  var appCtx = useApp();
  var activeBusiness = appCtx.activeBusiness;

  var productsState = useState([]);
  var products = productsState[0];
  var setProducts = productsState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var searchState = useState('');
  var search = searchState[0];
  var setSearch = searchState[1];

  var showModalState = useState(false);
  var showModal = showModalState[0];
  var setShowModal = showModalState[1];

  var editingState = useState(null);
  var editing = editingState[0];
  var setEditing = editingState[1];

  var formState = useState(EMPTY_FORM);
  var form = formState[0];
  var setForm = formState[1];

  var savingState = useState(false);
  var saving = savingState[0];
  var setSaving = savingState[1];

  var formErrorState = useState('');
  var formError = formErrorState[0];
  var setFormError = formErrorState[1];

  var deleteIdState = useState(null);
  var deleteId = deleteIdState[0];
  var setDeleteId = deleteIdState[1];

  var deletingState = useState(false);
  var deleting = deletingState[0];
  var setDeleting = deletingState[1];

  useEffect(function () {
    if (activeBusiness) loadProducts();
  }, [activeBusiness]);

  function loadProducts() {
    setLoading(true);
    productService
      .getAll(activeBusiness.id)
      .then(function (res) {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(function () {
        setProducts([]);
        setLoading(false);
      });
  }

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      name_en: product.name_en || '',
      name_ar: product.name_ar || '',
      description_en: product.description_en || '',
      description_ar: product.description_ar || '',
      category: product.category || '',
      price: product.price || '',
      is_available: product.is_available !== false,
    });
    setFormError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
  }

  function updateField(field, value) {
    setForm(function (prev) {
      var next = {};
      Object.keys(prev).forEach(function (k) { next[k] = prev[k]; });
      next[field] = value;
      return next;
    });
  }

  function handleSave() {
    if (!form.name_en.trim()) { setFormError('English name is required'); return; }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) { setFormError('Valid price is required'); return; }

    setSaving(true);
    setFormError('');

    var payload = {
      name_en: form.name_en.trim(),
      name_ar: form.name_ar.trim() || form.name_en.trim(),
      description_en: form.description_en.trim(),
      description_ar: form.description_ar.trim(),
      category: form.category.trim(),
      price: parseFloat(form.price),
      price_before_vat: Math.round((parseFloat(form.price) / 1.15) * 100) / 100,
      is_available: form.is_available,
      image_url: '',
    };

    var promise;
    if (editing) {
      promise = productService.update(editing.id, payload);
    } else {
      promise = productService.create(activeBusiness.id, payload);
    }

    promise
      .then(function () {
        closeModal();
        loadProducts();
        setSaving(false);
      })
      .catch(function (err) {
        var msg = 'Failed to save';
        if (err.response && err.response.data && err.response.data.detail) {
          msg = err.response.data.detail;
        }
        setFormError(msg);
        setSaving(false);
      });
  }

  function handleDelete(productId) {
    setDeleting(true);
    productService
      .remove(productId)
      .then(function () {
        setDeleteId(null);
        setDeleting(false);
        loadProducts();
      })
      .catch(function () {
        setDeleting(false);
      });
  }

  function handleToggle(product) {
    var payload = {
      name_en: product.name_en,
      name_ar: product.name_ar,
      description_en: product.description_en || '',
      description_ar: product.description_ar || '',
      category: product.category || '',
      price: product.price,
      price_before_vat: product.price_before_vat || Math.round((product.price / 1.15) * 100) / 100,
      is_available: !product.is_available,
      image_url: product.image_url || '',
    };

    productService.update(product.id, payload).then(function () {
      loadProducts();
    });
  }

  if (!activeBusiness) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center text-gray-500'>
          <p className='text-4xl mb-3'>{'\uD83D\uDCE6'}</p>
          <p className='font-medium'>Select a business from the header</p>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner size='lg' text='Loading products...' />;

  var categories = {};
  products.forEach(function (p) {
    var cat = p.category || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(p);
  });

  var availableCount = products.filter(function (p) { return p.is_available !== false; }).length;
  var unavailableCount = products.length - availableCount;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {(activeBusiness ? activeBusiness.emoji : '') +
              ' ' +
              (activeBusiness ? activeBusiness.displayName : '') +
              ' \u2014 Products'}
          </h1>
          <p className='text-gray-500'>
            {products.length + ' products \u00B7 ' + availableCount + ' available \u00B7 ' + unavailableCount + ' hidden \u00B7 15% VAT included'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className='flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow'
        >
          <Plus className='w-5 h-5' />
          {'Add Product'}
        </button>
      </div>

      {/* Search */}
      <div className='relative max-w-md'>
        <Search size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
        <input
          type='text'
          placeholder='Search products...'
          value={search}
          onChange={function (e) { setSearch(e.target.value); }}
          className='h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
        />
      </div>

      {/* Products */}
      {Object.keys(categories).length === 0 ? (
        <EmptyState
          icon={<Package size={48} />}
          title='No products yet'
          description='Add your first product to get started'
          action={
            <button onClick={openAdd} className='px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700'>
              <Plus className='w-4 h-4 inline mr-1' />{'Add First Product'}
            </button>
          }
        />
      ) : (
        Object.keys(categories).sort().map(function (cat) {
          var catProducts = categories[cat].filter(function (p) {
            var q = search.toLowerCase();
            return !q || (p.name_en || '').toLowerCase().includes(q) || (p.name_ar || '').includes(q);
          });
          if (catProducts.length === 0) return null;
          return (
            <Card key={cat} title={cat + ' (' + catProducts.length + ')'}>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
                {catProducts.map(function (p) {
                  var isDeleting = deleteId === p.id;
                  return (
                    <div
                      key={p.id}
                      className={'rounded-lg border p-4 transition-shadow hover:shadow-md ' + (p.is_available === false ? 'border-gray-200 bg-gray-50 opacity-70' : 'border-gray-200')}
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex-1 min-w-0'>
                          <h4 className='font-semibold text-gray-900'>{p.name_en}</h4>
                          <p className='text-sm text-gray-400' dir='rtl'>{p.name_ar}</p>
                          {p.description_en && (
                            <p className='mt-1 text-xs text-gray-500 line-clamp-2'>{p.description_en}</p>
                          )}
                        </div>
                        <span
                          className={'rounded-full px-2 py-0.5 text-xs font-medium ' + (p.is_available !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}
                        >
                          {p.is_available !== false ? 'Available' : 'Hidden'}
                        </span>
                      </div>

                      <div className='mt-3 flex items-center justify-between'>
                        <div>
                          <p className='text-lg font-bold text-indigo-600'>{formatSAR(p.price)}</p>
                          {p.price_before_vat && (
                            <p className='text-xs text-gray-400'>{'Before VAT: ' + formatSAR(p.price_before_vat)}</p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className='mt-3 flex gap-2 border-t border-gray-100 pt-3'>
                        <button
                          onClick={function () { openEdit(p); }}
                          className='flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition'
                        >
                          <Pencil size={13} />{'Edit'}
                        </button>
                        <button
                          onClick={function () { handleToggle(p); }}
                          className={'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg transition ' + (p.is_available !== false ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-green-700 bg-green-50 hover:bg-green-100')}
                        >
                          {p.is_available !== false ? <><EyeOff size={13} />{'Hide'}</> : <><Eye size={13} />{'Show'}</>}
                        </button>
                        <button
                          onClick={function () { setDeleteId(p.id); }}
                          className='flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition'
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Delete confirmation */}
                      {isDeleting && (
                        <div className='mt-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
                          <p className='text-xs font-medium text-red-800 mb-2'>
                            {'Delete "' + p.name_en + '"?'}
                          </p>
                          <div className='flex gap-2'>
                            <button
                              onClick={function () { handleDelete(p.id); }}
                              disabled={deleting}
                              className='flex-1 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 disabled:opacity-50'
                            >
                              {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                            <button
                              onClick={function () { setDeleteId(null); }}
                              className='flex-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200'
                            >
                              {'Cancel'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })
      )}

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={closeModal} />
          <div className='relative mx-4 w-full max-w-lg rounded-2xl bg-white shadow-2xl'>
            {/* Modal header */}
            <div className='flex items-center justify-between border-b px-6 py-4'>
              <h2 className='text-xl font-bold text-gray-900'>
                {editing ? '\u270F\uFE0F Edit Product' : '\u2795 Add New Product'}
              </h2>
              <button onClick={closeModal} className='rounded-lg p-1 text-gray-400 hover:bg-gray-100'>
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div className='p-6 space-y-4 max-h-[70vh] overflow-y-auto'>
              {formError && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700'>
                  {formError}
                </div>
              )}

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>{'Product Name (English) *'}</label>
                <input
                  type='text'
                  value={form.name_en}
                  onChange={function (e) { updateField('name_en', e.target.value); }}
                  placeholder='e.g. Chicken Burger'
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>{'\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062A\u062C (\u0639\u0631\u0628\u064A)'}</label>
                <input
                  type='text'
                  value={form.name_ar}
                  onChange={function (e) { updateField('name_ar', e.target.value); }}
                  placeholder='\u0645\u062B\u0627\u0644: \u0628\u0631\u062C\u0631 \u062F\u062C\u0627\u062C'
                  dir='rtl'
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>{'Description (English)'}</label>
                <textarea
                  value={form.description_en}
                  onChange={function (e) { updateField('description_en', e.target.value); }}
                  placeholder='Describe your product...'
                  rows={2}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-vertical'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>{'\u0627\u0644\u0648\u0635\u0641 (\u0639\u0631\u0628\u064A)'}</label>
                <textarea
                  value={form.description_ar}
                  onChange={function (e) { updateField('description_ar', e.target.value); }}
                  placeholder='\u0648\u0635\u0641 \u0627\u0644\u0645\u0646\u062A\u062C...'
                  rows={2}
                  dir='rtl'
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-vertical'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>{'Price (SAR incl. VAT) *'}</label>
                  <input
                    type='number'
                    step='0.01'
                    min='0'
                    value={form.price}
                    onChange={function (e) { updateField('price', e.target.value); }}
                    placeholder='0.00'
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>{'Category'}</label>
                  <input
                    type='text'
                    value={form.category}
                    onChange={function (e) { updateField('category', e.target.value); }}
                    placeholder='e.g. Chicken'
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  />
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='is_available'
                  checked={form.is_available}
                  onChange={function (e) { updateField('is_available', e.target.checked); }}
                  className='w-4 h-4 accent-indigo-600'
                />
                <label htmlFor='is_available' className='text-sm text-gray-700'>{'Available for customers'}</label>
              </div>
            </div>

            {/* Modal footer */}
            <div className='border-t px-6 py-4 flex gap-3'>
              <button
                onClick={closeModal}
                className='flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition'
              >
                {'Cancel'}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className='flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50'
              >
                {saving ? 'Saving...' : editing ? '\uD83D\uDCBE Update Product' : '\u2795 Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
