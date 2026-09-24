import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ChevronRight } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Seerat & Programs', path: '/seerat' },
    { name: 'Contact for Donations', path: '/donations' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Foundation Logo & Name */}
          <Logo size="md" />

          {/* Right: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'text-[#0e6245] bg-emerald-50/80 font-bold'
                      : 'text-gray-700 hover:text-[#0e6245] hover:bg-gray-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="h-5 w-px bg-gray-200 mx-2" />

            {/* Discreet Admin Link */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-md border border-gray-200 transition-colors"
              title="Foundation Administration Access"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/admin"
              className="p-2 text-gray-500 hover:text-emerald-800 hover:bg-gray-100 rounded-lg"
              title="Admin"
              aria-label="Admin Access"
            >
              <Shield className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-fadeIn">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-[#0e6245] font-bold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span>{link.name}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </NavLink>
          ))}

          <div className="pt-4 border-t border-gray-100">
            <Link
              to="/admin"
              className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-900"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-700" />
                Staff / Admin Portal
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
