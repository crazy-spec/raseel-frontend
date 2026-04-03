import clsx from 'clsx';

export default function Card({ children, className, title, action, noPad }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        className
      )}
    >
      {(title || action) && (
        <div className='flex items-center justify-between border-b border-gray-100 px-6 py-4'>
          {title && (
            <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPad ? '' : 'p-6'}>{children}</div>
    </div>
  );
}
