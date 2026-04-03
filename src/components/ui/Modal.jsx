import { X } from 'lucide-react';
import clsx from 'clsx';

export default function Modal({ isOpen, onClose, title, children, size }) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative mx-4 w-full rounded-2xl bg-white shadow-2xl',
          sizes[size || 'md']
        )}
      >
        <div className='flex items-center justify-between border-b px-6 py-4'>
          <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
          <button
            onClick={onClose}
            className='rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          >
            <X size={20} />
          </button>
        </div>
        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
}
