import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Notification from '../ui/Notification';
import { useApp } from '../../context/AppContext';
import clsx from 'clsx';

export default function Layout() {
  const { sidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div
        className={clsx(
          'transition-all duration-300',
          'ml-0 md:ml-20',
          sidebarOpen && 'md:ml-64'
        )}
      >
        <Header />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <Notification />
    </div>
  );
}
