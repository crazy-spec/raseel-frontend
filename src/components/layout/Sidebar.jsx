import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Package,
  ShoppingCart,
  Users,
  Bot,
  Shield,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronLeft,
  Target,
  X,
  LogOut,
  Megaphone,
} from 'lucide-react';
import clsx from 'clsx';

var ALL_NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['super_admin', 'business_owner', 'staff'] },
  { to: '/businesses', icon: Building2, label: 'Businesses', roles: ['super_admin'] },
  { to: '/products', icon: Package, label: 'Products', roles: ['super_admin', 'business_owner', 'staff'] },
  { to: '/orders', icon: ShoppingCart, label: 'Orders', roles: ['super_admin', 'business_owner', 'staff'] },
  { to: '/customers', icon: Users, label: 'Customers', roles: ['super_admin', 'business_owner'] },
  { to: '/agents', icon: Bot, label: 'AI Agents', roles: ['super_admin', 'business_owner', 'staff'] },
  { to: '/campaigns', icon: Megaphone, label: 'Campaigns', roles: ['super_admin', 'business_owner'] },
  { to: '/leads', icon: Target, label: 'Lead Finder', roles: ['super_admin'] },
  { to: '/conversations', icon: MessageSquare, label: 'Conversations', roles: ['super_admin', 'business_owner'] },
  { to: '/pdpl', icon: Shield, label: 'PDPL Compliance', roles: ['super_admin', 'business_owner'] },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['super_admin', 'business_owner'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['super_admin', 'business_owner', 'staff'] },
];

export default function Sidebar() {
  var app = useApp();
  var sidebarOpen = app.sidebarOpen;
  var mobileSidebarOpen = app.mobileSidebarOpen;
  var dispatch = app.dispatch;

  var auth = useAuth();
  var navigate = useNavigate();

  var userRole = (auth.user && auth.user.role) || 'staff';

  var navItems = ALL_NAV_ITEMS.filter(function(item) {
    return item.roles.indexOf(userRole) >= 0;
  });

  var handleLogout = function() {
    auth.logout();
    if (mobileSidebarOpen) {
      dispatch({ type: 'CLOSE_MOBILE_SIDEBAR' });
    }
    navigate('/login');
  };

  return (
    <>
      {mobileSidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden'
          onClick={function() { dispatch({ type: 'CLOSE_MOBILE_SIDEBAR' }); }}
        />
      )}

      <aside
        className={clsx(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300',
          'md:translate-x-0',
          sidebarOpen ? 'md:w-64' : 'md:w-20',
          mobileSidebarOpen ? 'w-72 translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className='flex h-16 items-center justify-between border-b px-4'>
          <div className='flex items-center gap-2'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white'>
              {'R'}
            </div>
            {(sidebarOpen || mobileSidebarOpen) && (
              <span className='text-xl font-bold text-gray-900'>{'Raseel'}</span>
            )}
          </div>
          <button
            onClick={function() { dispatch({ type: mobileSidebarOpen ? 'CLOSE_MOBILE_SIDEBAR' : 'TOGGLE_SIDEBAR' }); }}
            className='rounded-lg p-1.5 text-gray-400 hover:bg-gray-100'
          >
            {mobileSidebarOpen ? (
              <X size={20} />
            ) : (
              <ChevronLeft
                size={20}
                className={clsx('transition-transform', !sidebarOpen && 'rotate-180')}
              />
            )}
          </button>
        </div>

        <nav className='flex-1 overflow-y-auto px-3 py-4'>
          <ul className='space-y-1'>
            {navItems.map(function(item) {
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={function() {
                      if (mobileSidebarOpen) dispatch({ type: 'CLOSE_MOBILE_SIDEBAR' });
                    }}
                    className={function(props) {
                      return clsx(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        props.isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      );
                    }}
                  >
                    <item.icon size={20} />
                    {(sidebarOpen || mobileSidebarOpen) && <span>{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className='border-t px-3 py-3'>
          {auth.user && (sidebarOpen || mobileSidebarOpen) && (
            <div className='mb-3 px-3'>
              <p className='text-sm font-medium text-gray-900 truncate'>{auth.user.full_name}</p>
              <p className='text-xs text-gray-500 truncate'>{auth.user.email}</p>
              <p className='text-xs text-indigo-600 font-medium mt-0.5'>
                {auth.user.role === 'super_admin' ? 'Super Admin' : auth.user.role === 'business_owner' ? 'Business Owner' : 'Staff'}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={clsx(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors w-full',
              'text-red-600 hover:bg-red-50'
            )}
          >
            <LogOut size={20} />
            {(sidebarOpen || mobileSidebarOpen) && <span>{'Sign Out'}</span>}
          </button>
          {(sidebarOpen || mobileSidebarOpen) && (
            <div className='mt-3 px-3'>
              <p className='text-xs text-gray-400'>{'Raseel Platform v2.0'}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
