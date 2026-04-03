import clsx from 'clsx';

var colorMap = {
  emerald: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  green: 'bg-green-50 text-green-600',
  pink: 'bg-pink-50 text-pink-600',
};

export default function StatCard(props) {
  var title = props.title;
  var value = props.value;
  var icon = props.icon;
  var color = props.color || 'indigo';
  var subtitle = props.subtitle;
  var trend = props.trend || null;

  return (
    <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex items-center justify-between'>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-gray-500 truncate'>{title}</p>
          <div className='flex items-center gap-2 mt-1'>
            <p className='text-2xl font-bold text-gray-900 truncate'>{value}</p>
            {trend !== null && (
              <span
                className={clsx(
                  'inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium',
                  trend > 0
                    ? 'bg-green-50 text-green-700'
                    : trend < 0
                    ? 'bg-red-50 text-red-700'
                    : 'bg-gray-50 text-gray-600'
                )}
              >
                {trend > 0 ? '\u2191' : trend < 0 ? '\u2193' : '\u2192'}
                {Math.abs(trend) + '%'}
              </span>
            )}
          </div>
          {subtitle && <p className='text-xs text-gray-400 mt-1'>{subtitle}</p>}
        </div>
        <div
          className={clsx(
            'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
            colorMap[color] || colorMap.indigo
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
