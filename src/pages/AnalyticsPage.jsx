import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ComingSoonState from '../components/ui/ComingSoonState';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
  MessageSquare,
  Target,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

var COLORS = ['#4f46e5', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

var DEMO_DAILY = [
  { day: 'Sat', sent: 120, received: 95 },
  { day: 'Sun', sent: 145, received: 110 },
  { day: 'Mon', sent: 200, received: 180 },
  { day: 'Tue', sent: 187, received: 165 },
  { day: 'Wed', sent: 220, received: 195 },
  { day: 'Thu', sent: 240, received: 210 },
  { day: 'Fri', sent: 80, received: 60 },
];

var DEMO_RESPONSE = [
  { hour: '8AM', avg: 1.2 },
  { hour: '10AM', avg: 0.8 },
  { hour: '12PM', avg: 2.1 },
  { hour: '2PM', avg: 1.5 },
  { hour: '4PM', avg: 0.9 },
  { hour: '6PM', avg: 1.8 },
  { hour: '8PM', avg: 3.2 },
];

var DEMO_RESOLUTION = [
  { name: 'Auto-resolved', value: 68 },
  { name: 'Escalated', value: 12 },
  { name: 'Pending', value: 8 },
  { name: 'Follow-up', value: 12 },
];

export default function AnalyticsPage() {
  var appCtx = useApp();
  var authCtx = useAuth();
  var activeBusiness = appCtx.activeBusiness;
  var user = authCtx.user;
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  var periodState = useState('7d');
  var period = periodState[0];
  var setPeriod = periodState[1];
  var showDemoState = useState(false);
  var showDemo = showDemoState[0];
  var setShowDemo = showDemoState[1];

  var isAdmin = user && (user.role === 'super_admin' || user.role === 'admin');
  var isConnected = activeBusiness && activeBusiness.whatsapp_phone;

  useEffect(function () {
    var t = setTimeout(function () {
      setLoading(false);
    }, 400);
    return function () {
      clearTimeout(t);
    };
  }, [activeBusiness]);

  if (loading) return <LoadingSpinner size='lg' text='Loading analytics...' />;

  if (!isConnected && !showDemo) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {'\uD83D\uDCC8 Analytics'}
          </h1>
          <p className='text-gray-500'>Performance insights and metrics</p>
        </div>
        <ComingSoonState
          icon={'\uD83D\uDCC8'}
          title='Analytics activate after WhatsApp connection'
          description='Once your WhatsApp Business is connected, you will see real-time message volume, response times, AI resolution rates, and customer satisfaction scores here.'
          requiredStep='Connect your WhatsApp Business number in Settings'
          onPreview={function () {
            setShowDemo(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {'\uD83D\uDCC8 Analytics'}
          </h1>
          <p className='text-gray-500'>Performance insights and metrics</p>
        </div>
        <div className='flex items-center gap-3'>
          {showDemo && (
            <div className='flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5'>
              <span className='text-xs font-medium text-amber-700'>
                {'\uD83D\uDC41\uFE0F Demo Preview'}
              </span>
              <button
                onClick={function () {
                  setShowDemo(false);
                }}
                className='text-amber-600 hover:text-amber-800'
              >
                <EyeOff size={14} />
              </button>
            </div>
          )}
          <div className='flex gap-2'>
            {['24h', '7d', '30d', '90d'].map(function (p) {
              return (
                <button
                  key={p}
                  onClick={function () {
                    setPeriod(p);
                  }}
                  className={
                    'rounded-lg px-3 py-1.5 text-sm font-medium ' +
                    (period === p
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100')
                  }
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {showDemo && (
        <div className='bg-amber-50 border border-amber-200 rounded-xl p-4'>
          <p className='text-sm text-amber-800 font-medium'>
            {'\u26A0\uFE0F Sample Data Preview — These numbers are examples. Real analytics appear after WhatsApp connection.'}
          </p>
        </div>
      )}

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Avg Response Time'
          value={isConnected ? '—' : '1.2s'}
          icon={<Clock size={24} />}
          color='indigo'
          trend={isConnected ? null : -15}
        />
        <StatCard
          title='Resolution Rate'
          value={isConnected ? '—' : '92%'}
          icon={<Target size={24} />}
          color='blue'
          trend={isConnected ? null : 5}
        />
        <StatCard
          title='Messages/Day'
          value={isConnected ? '0' : '1,192'}
          icon={<MessageSquare size={24} />}
          color='purple'
          trend={isConnected ? null : 22}
        />
        <StatCard
          title='AI Accuracy'
          value={isConnected ? '—' : '96%'}
          icon={<Zap size={24} />}
          color='amber'
          trend={isConnected ? null : 3}
        />
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Card title='Daily Messages'>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={DEMO_DAILY}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis dataKey='day' fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey='sent' fill='#4f46e5' radius={[4, 4, 0, 0]} />
              <Bar dataKey='received' fill='#3b82f6' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title='Avg Response Time (seconds)'>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={DEMO_RESPONSE}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis dataKey='hour' fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='avg'
                stroke='#4f46e5'
                strokeWidth={3}
                dot={{ r: 6, fill: '#4f46e5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title='Resolution Breakdown'>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={DEMO_RESOLUTION}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={110}
                paddingAngle={3}
                dataKey='value'
              >
                {DEMO_RESOLUTION.map(function (entry, i) {
                  return (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  );
                })}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title='Quick Summary'>
          <div className='space-y-4 py-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center'>
                <BarChart3 size={20} className='text-indigo-600' />
              </div>
              <div>
                <p className='font-medium text-gray-900'>Peak Hours</p>
                <p className='text-sm text-gray-500'>
                  {isConnected
                    ? 'Connect WhatsApp to see peak hours'
                    : 'Thu 4-6 PM (sample)'}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center'>
                <TrendingUp size={20} className='text-green-600' />
              </div>
              <div>
                <p className='font-medium text-gray-900'>Top Inquiry</p>
                <p className='text-sm text-gray-500'>
                  {isConnected
                    ? 'Connect WhatsApp to see top inquiries'
                    : 'Menu & pricing questions (sample)'}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center'>
                <Zap size={20} className='text-purple-600' />
              </div>
              <div>
                <p className='font-medium text-gray-900'>AI Savings</p>
                <p className='text-sm text-gray-500'>
                  {isConnected
                    ? 'Savings calculated after first week'
                    : '~4,200 SAR/month in staff time (sample)'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
