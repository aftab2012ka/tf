import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Image as ImageIcon,
  Landmark,
  Settings,
  LogOut,
  ExternalLink,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

export default function AdminLayout() {
  const { isAdmin, loading, logout, currentUser, isDemoAdminActive } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-[#0e6245] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Admissions', path: '/admin/admissions', icon: GraduationCap },
    { name: 'Seerat Participants', path: '/admin/participants', icon: Users },
    { name: 'Gallery Media', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Donation Settings', path: '/admin/donations', icon: Landmark },
    { name: 'Site Settings', path: '/admin/site-settings', icon: Settings },
    { name: 'Setup & Deployment Guide', path: '/admin/setup-guide', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-gray-300 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-gray-800">
            <Logo whiteText size="sm" />
            <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-400 bg-gray-800/80 px-2.5 py-1 rounded-md">
              <span>Admin Session</span>
              <span className="font-mono text-[10px]">
                {isDemoAdminActive ? 'Demo Admin' : currentUser?.email || 'Authenticated'}
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#0e6245] text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View Public Website
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            TUBA FOUNDATION GOKAK — MANAGEMENT SYSTEM
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-700 font-medium">System Online</span>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
