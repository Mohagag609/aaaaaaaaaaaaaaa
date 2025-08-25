import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  FolderIcon, 
  CubeIcon, 
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'لوحة التحكم', href: '/', icon: HomeIcon },
    { name: 'العملاء', href: '/clients', icon: UsersIcon },
    { name: 'العقود', href: '/contracts', icon: DocumentTextIcon },
    { name: 'الوحدات', href: '/units', icon: BuildingOfficeIcon },
    { name: 'الشركاء', href: '/partners', icon: UserGroupIcon },
    { name: 'المشاريع', href: '/projects', icon: FolderIcon },
    { name: 'المواد', href: '/materials', icon: CubeIcon },
    { name: 'التقارير', href: '/reports', icon: ChartBarIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* القائمة الجانبية للموبايل */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-secondary-900 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 right-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-6 border-b border-secondary-200">
            <h1 className="text-xl font-bold text-primary-600">نظام العقارات</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-secondary-400 hover:text-secondary-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`nav-link ${
                  isActive(item.href) ? 'nav-link-active' : 'nav-link-inactive'
                }`}
              >
                <item.icon className="ml-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* القائمة الجانبية للديسكتوب */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-l border-secondary-200">
          <div className="flex h-16 items-center px-6 border-b border-secondary-200">
            <h1 className="text-xl font-bold text-primary-600">نظام العقارات</h1>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${
                  isActive(item.href) ? 'nav-link-active' : 'nav-link-inactive'
                }`}
              >
                <item.icon className="ml-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* معلومات النظام */}
          <div className="p-4 border-t border-secondary-200">
            <div className="text-xs text-secondary-500 text-center">
              <p>نظام إدارة العقارات</p>
              <p className="mt-1">الإصدار 1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="lg:pr-64">
        {/* الرأس */}
        <header className="bg-white shadow-sm border-b border-secondary-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* زر القائمة للموبايل */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* البحث */}
            <div className="flex-1 max-w-lg mx-4 lg:mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="البحث في النظام..."
                  className="input pr-10 w-full"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* الإشعارات والملف الشخصي */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* الإشعارات */}
              <button className="p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-danger-400"></span>
              </button>

              {/* الملف الشخصي */}
              <div className="relative">
                <button className="flex items-center space-x-3 space-x-reverse p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100">
                  <UserCircleIcon className="h-8 w-8" />
                  <span className="hidden sm:block text-sm font-medium text-secondary-700">المدير</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* المحتوى */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
