import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';
import clsx from 'clsx';

export default function Notification() {
  const { notification, dispatch } = useApp();

  if (!notification) return null;

  const styles = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
    warning: 'bg-amber-50 border-amber-400 text-amber-800',
  };

  return (
    <div className='fixed right-4 top-4 z-50 animate-slide-in'>
      <div
        className={clsx(
          'flex items-center gap-3 rounded-lg border-l-4 px-4 py-3 shadow-lg',
          styles[notification.type] || styles.info
        )}
      >
        <p className='text-sm font-medium'>{notification.message}</p>
        <button
          onClick={() => dispatch({ type: 'CLEAR_NOTIFICATION' })}
          className='ml-2 opacity-60 hover:opacity-100'
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
