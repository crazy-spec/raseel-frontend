import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ComingSoonState from '../components/ui/ComingSoonState';

var DEMO_LEADS = [
  { id: 1, name: '\u0634\u0631\u0643\u0629 \u0627\u0644\u0641\u0647\u062F \u0644\u0644\u0645\u0642\u0627\u0648\u0644\u0627\u062A', contact: '\u0645\u062D\u0645\u062F \u0627\u0644\u0641\u0647\u062F', phone: '+966 55 XXX 1234', sector: 'construction', status: 'new', city: 'Riyadh', notes: 'Interested in AI customer service', score: 85, created_at: '2026-03-15' },
  { id: 2, name: '\u0645\u0637\u0639\u0645 \u0627\u0644\u062F\u064A\u0631\u0629', contact: '\u0639\u0628\u062F\u0627\u0644\u0644\u0647 \u0627\u0644\u0642\u062D\u0637\u0627\u0646\u064A', phone: '+966 50 XXX 5678', sector: 'restaurant', status: 'contacted', city: 'Jeddah', notes: 'Has 3 branches, wants WhatsApp ordering', score: 92, created_at: '2026-03-14' },
  { id: 3, name: '\u0639\u064A\u0627\u062F\u0629 \u0627\u0644\u0628\u0633\u0645\u0629', contact: '\u062F. \u0633\u0627\u0631\u0629 \u0627\u0644\u0623\u062D\u0645\u062F', phone: '+966 54 XXX 9012', sector: 'medical', status: 'meeting', city: 'Dammam', notes: 'Wants appointment booking via WhatsApp', score: 78, created_at: '2026-03-13' },
  { id: 4, name: '\u0641\u0646\u062F\u0642 \u0627\u0644\u0646\u062C\u0645\u0629', contact: '\u062E\u0627\u0644\u062F \u0627\u0644\u0639\u0645\u0631\u064A', phone: '+966 56 XXX 3456', sector: 'hotel', status: 'proposal', city: 'Riyadh', notes: '5-star hotel, wants guest concierge AI', score: 95, created_at: '2026-03-12' },
  { id: 5, name: '\u0635\u0627\u0644\u0648\u0646 \u0644\u0645\u0633\u0629 \u062C\u0645\u0627\u0644', contact: '\u0646\u0648\u0631\u0629 \u0627\u0644\u0633\u0639\u064A\u062F', phone: '+966 58 XXX 7890', sector: 'salon', status: 'won', city: 'Jeddah', notes: 'Signed up for Professional plan!', score: 100, created_at: '2026-03-10' },
];

var STATUS_CONFIG = {
  new: { label: 'New', emoji: '\uD83C\uDD95', color: 'bg-blue-100 text-blue-700', next: 'contacted' },
  contacted: { label: 'Contacted', emoji: '\uD83D\uDCDE', color: 'bg-yellow-100 text-yellow-700', next: 'meeting' },
  meeting: { label: 'Meeting', emoji: '\uD83E\uDD1D', color: 'bg-purple-100 text-purple-700', next: 'proposal' },
  proposal: { label: 'Proposal', emoji: '\uD83D\uDCC4', color: 'bg-orange-100 text-orange-700', next: 'won' },
  won: { label: 'Won!', emoji: '\uD83C\uDF89', color: 'bg-green-100 text-green-700', next: null },
  lost: { label: 'Lost', emoji: '\u274C', color: 'bg-red-100 text-red-700', next: null },
};

var SECTOR_ICONS = {
  restaurant: '\uD83C\uDF57', medical: '\uD83C\uDFE5', hotel: '\uD83C\uDFE8', retail: '\uD83D\uDECD\uFE0F',
  salon: '\uD83D\uDC87', education: '\uD83C\uDF93', construction: '\uD83C\uDFD7\uFE0F', automotive: '\uD83D\uDE97',
};

export default function LeadFinderPage() {
  var authCtx = useAuth();
  var user = authCtx.user;
  var isAdmin = user && (user.role === 'super_admin' || user.role === 'admin');

  var leadsState = useState(isAdmin ? DEMO_LEADS : []);
  var leads = leadsState[0];
  var setLeads = leadsState[1];
  var filterState = useState('all');
  var filter = filterState[0];
  var setFilter = filterState[1];
  var showAddState = useState(false);
  var showAdd = showAddState[0];
  var setShowAdd = showAddState[1];
  var newLeadState = useState({
    name: '', contact: '', phone: '', sector: 'restaurant', city: '', notes: '',
  });
  var newLead = newLeadState[0];
  var setNewLead = newLeadState[1];

  if (!isAdmin) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {'\uD83C\uDFAF Lead Finder CRM'}
          </h1>
          <p className='text-gray-500'>Track and convert sales prospects</p>
        </div>
        <ComingSoonState
          icon={'\uD83C\uDFAF'}
          title='Lead Finder is an admin feature'
          description='This CRM tool is available for platform administrators to track sales prospects and convert them into Raseel clients.'
          requiredStep='Contact your admin for access'
        />
      </div>
    );
  }

  var filtered = filter === 'all' ? leads : leads.filter(function (l) { return l.status === filter; });

  var statusCounts = {
    all: leads.length,
    new: leads.filter(function (l) { return l.status === 'new'; }).length,
    contacted: leads.filter(function (l) { return l.status === 'contacted'; }).length,
    meeting: leads.filter(function (l) { return l.status === 'meeting'; }).length,
    proposal: leads.filter(function (l) { return l.status === 'proposal'; }).length,
    won: leads.filter(function (l) { return l.status === 'won'; }).length,
    lost: leads.filter(function (l) { return l.status === 'lost'; }).length,
  };

  function moveToNextStage(id) {
    setLeads(function (prev) {
      return prev.map(function (l) {
        if (l.id === id && STATUS_CONFIG[l.status] && STATUS_CONFIG[l.status].next) {
          return Object.assign({}, l, { status: STATUS_CONFIG[l.status].next });
        }
        return l;
      });
    });
  }

  function markLost(id) {
    setLeads(function (prev) {
      return prev.map(function (l) {
        return l.id === id ? Object.assign({}, l, { status: 'lost' }) : l;
      });
    });
  }

  function addLead() {
    if (!newLead.name || !newLead.contact) return;
    setLeads(function (prev) {
      return prev.concat([
        Object.assign({}, newLead, {
          id: Date.now(),
          status: 'new',
          score: 50,
          created_at: new Date().toISOString().split('T')[0],
        }),
      ]);
    });
    setNewLead({ name: '', contact: '', phone: '', sector: 'restaurant', city: '', notes: '' });
    setShowAdd(false);
  }

  var pipeline = ['new', 'contacted', 'meeting', 'proposal', 'won'];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {'\uD83C\uDFAF Lead Finder CRM'}
          </h1>
          <p className='text-gray-500 mt-1'>
            Track and convert sales prospects into Raseel clients
          </p>
        </div>
        <button
          onClick={function () { setShowAdd(true); }}
          className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow'
        >
          {'\u2795 Add Lead'}
        </button>
      </div>

      <div className='bg-amber-50 border border-amber-200 rounded-xl p-3'>
        <p className='text-sm text-amber-800'>
          {'\u26A0\uFE0F Demo Data — Leads shown below are samples. In Phase 2, the AI Sales Team will auto-discover leads from Google Maps.'}
        </p>
      </div>

      <div className='bg-white rounded-xl shadow-sm border p-4'>
        <h3 className='font-medium text-gray-700 mb-3'>Sales Pipeline</h3>
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {pipeline.map(function (stage) {
            return (
              <div key={stage} className='flex-1 min-w-[120px] text-center'>
                <div className={'rounded-lg p-3 ' + STATUS_CONFIG[stage].color}>
                  <p className='text-2xl font-bold'>{statusCounts[stage]}</p>
                  <p className='text-xs font-medium'>
                    {STATUS_CONFIG[stage].emoji + ' ' + STATUS_CONFIG[stage].label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className='flex gap-2 flex-wrap'>
        {['all'].concat(Object.keys(STATUS_CONFIG)).map(function (s) {
          return (
            <button
              key={s}
              onClick={function () { setFilter(s); }}
              className={
                'px-3 py-1.5 rounded-lg text-sm font-medium transition ' +
                (filter === s
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white text-gray-600 border hover:bg-gray-50')
              }
            >
              {s === 'all'
                ? '\uD83D\uDCCB All (' + statusCounts.all + ')'
                : STATUS_CONFIG[s].emoji + ' ' + STATUS_CONFIG[s].label + ' (' + (statusCounts[s] || 0) + ')'}
            </button>
          );
        })}
      </div>

      {showAdd && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-xl p-6 w-full max-w-md'>
            <h3 className='text-lg font-bold text-gray-900 mb-4'>
              {'\u2795 Add New Lead'}
            </h3>
            <div className='space-y-3'>
              <input
                placeholder='Business Name'
                value={newLead.name}
                onChange={function (e) { setNewLead(Object.assign({}, newLead, { name: e.target.value })); }}
                className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none'
              />
              <input
                placeholder='Contact Person'
                value={newLead.contact}
                onChange={function (e) { setNewLead(Object.assign({}, newLead, { contact: e.target.value })); }}
                className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none'
              />
              <input
                placeholder='Phone'
                value={newLead.phone}
                onChange={function (e) { setNewLead(Object.assign({}, newLead, { phone: e.target.value })); }}
                className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none'
              />
              <select
                value={newLead.sector}
                onChange={function (e) { setNewLead(Object.assign({}, newLead, { sector: e.target.value })); }}
                className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none'
              >
                {Object.keys(SECTOR_ICONS).map(function (k) {
                  return (
                    <option key={k} value={k}>
                      {SECTOR_ICONS[k] + ' ' + k}
                    </option>
                  );
                })}
              </select>
              <input
                placeholder='City'
                value={newLead.city}
                onChange={function (e) { setNewLead(Object.assign({}, newLead, { city: e.target.value })); }}
                className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none'
              />
              <textarea
                placeholder='Notes'
                value={newLead.notes}
                onChange={function (e) { setNewLead(Object.assign({}, newLead, { notes: e.target.value })); }}
                className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none'
                rows={2}
              />
            </div>
            <div className='flex gap-3 mt-4'>
              <button
                onClick={addLead}
                className='flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium'
              >
                {'\u2705 Add Lead'}
              </button>
              <button
                onClick={function () { setShowAdd(false); }}
                className='flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='space-y-3'>
        {filtered.length === 0 ? (
          <div className='bg-white rounded-xl p-12 text-center shadow-sm'>
            <p className='text-4xl mb-3'>{'\uD83C\uDFAF'}</p>
            <p className='text-gray-500'>No leads in this stage</p>
          </div>
        ) : (
          filtered.map(function (lead) {
            return (
              <div
                key={lead.id}
                className='bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition'
              >
                <div className='flex flex-col sm:flex-row justify-between gap-3'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='text-xl'>
                        {SECTOR_ICONS[lead.sector] || '\uD83C\uDFE2'}
                      </span>
                      <h3 className='font-bold text-gray-900'>{lead.name}</h3>
                      <span
                        className={
                          'px-2 py-0.5 rounded-full text-xs font-medium ' +
                          (STATUS_CONFIG[lead.status]
                            ? STATUS_CONFIG[lead.status].color
                            : 'bg-gray-100')
                        }
                      >
                        {STATUS_CONFIG[lead.status]
                          ? STATUS_CONFIG[lead.status].emoji + ' ' + STATUS_CONFIG[lead.status].label
                          : lead.status}
                      </span>
                    </div>
                    <p className='text-sm text-gray-600'>
                      {'\uD83D\uDC64 ' + lead.contact + '  |  \uD83D\uDCDE ' + lead.phone + '  |  \uD83D\uDCCD ' + lead.city}
                    </p>
                    <p className='text-sm text-gray-500 mt-1'>
                      {'\uD83D\uDCDD ' + lead.notes}
                    </p>
                    <div className='flex items-center gap-2 mt-2'>
                      <div className='flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]'>
                        <div
                          className={
                            'h-2 rounded-full ' +
                            (lead.score >= 80
                              ? 'bg-green-500'
                              : lead.score >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500')
                          }
                          style={{ width: lead.score + '%' }}
                        ></div>
                      </div>
                      <span className='text-xs text-gray-500'>
                        {'Score: ' + lead.score + '%'}
                      </span>
                      <span className='text-xs text-gray-400'>
                        {'Added: ' + lead.created_at}
                      </span>
                    </div>
                  </div>
                  <div className='flex sm:flex-col gap-2'>
                    {STATUS_CONFIG[lead.status] &&
                      STATUS_CONFIG[lead.status].next && (
                        <button
                          onClick={function () {
                            moveToNextStage(lead.id);
                          }}
                          className='px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition whitespace-nowrap'
                        >
                          {'\u27A1\uFE0F Move to ' +
                            STATUS_CONFIG[STATUS_CONFIG[lead.status].next].label}
                        </button>
                      )}
                    {lead.status !== 'won' && lead.status !== 'lost' && (
                      <button
                        onClick={function () {
                          markLost(lead.id);
                        }}
                        className='px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-red-50 hover:text-red-600 transition'
                      >
                        {'\u274C Lost'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
