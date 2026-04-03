import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='text-center'>
        <p className='text-8xl font-bold text-indigo-600 mb-4'>404</p>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Page Not Found</h1>
        <p className='text-gray-500 mb-8'>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to='/'
          className='inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition'
        >
          {"\u2190 Back to Dashboard"}
        </Link>
      </div>
    </div>
  );
}
