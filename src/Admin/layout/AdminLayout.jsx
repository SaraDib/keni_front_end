import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Home, Settings, FileText, LogOut, Menu, X, Activity, HelpCircle, Building, Phone, Briefcase,
  UserCheck, Clock, Users, Layers, ClipboardList, Package, ChevronsLeft, ChevronsRight, ChevronRight, Info,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../ui';

// Navigation du back-office : source unique pour la barre latérale et le fil d'Ariane.
const NAV_SECTIONS = [
  {
    items: [{ to: 'dashboard', label: 'Tableau de bord', icon: Home }],
  },
  {
    title: 'Services',
    items: [
      { to: 'services', label: 'Gestion des services', icon: Layers },
      { to: 'experts', label: 'Section experts', icon: Activity },
      { to: 'about-us', label: 'Qui sommes-nous', icon: Info },
      { to: 'updates', label: 'Mises à jour', icon: FileText },
      { to: 'gestion-recettes', label: 'Types de recettes', icon: ClipboardList },
      { to: 'physiotherapie', label: 'Packs et services', icon: Package },
    ],
  },
  {
    title: 'Pages',
    items: [
      { to: 'faq', label: 'FAQ', icon: HelpCircle },
      { to: 'health-center', label: 'Centres Global Health', icon: Building },
      { to: 'contact', label: 'Messages de contact', icon: Phone },
      { to: 'job-offers', label: 'Candidatures', icon: Briefcase },
      { to: 'people', label: "L'équipe", icon: UserCheck },
      { to: 'appointments', label: 'Rendez-vous', icon: Clock },
    ],
  },
  {
    title: 'Administration',
    items: [
      { to: 'users', label: 'Utilisateurs', icon: Users },
      { to: 'settings', label: 'Paramètres', icon: Settings },
    ],
  },
];

const findNavItem = (pathname) => {
  const slug = pathname.split('/').filter(Boolean)[1] || 'dashboard';
  for (const section of NAV_SECTIONS) {
    const item = section.items.find((i) => i.to === slug);
    if (item) return { section: section.title, item };
  }
  return { section: null, item: null };
};

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, loading: authLoading } = useAuth();

  // Check if user is logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Appliquer la police Open Sans à toute l'application
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Open Sans', sans-serif";

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const collapsed = isCollapsed && !isMobile;

  return (
    <div className="flex h-screen flex-col bg-gray-50" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm',
          success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
          error: { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
        }}
      />
      {/* Mobile Navbar */}
      <div className="z-20 flex items-center justify-between bg-brand-950 px-4 py-3 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Ouvrir le menu"
        >
          <Menu size={22} />
        </button>
        <Logo />
        <span className="w-10" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop (fixed) and Mobile (overlay) */}
        <aside
          className={`
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed z-30 h-full transition-all duration-300 ease-in-out
            md:relative md:z-auto md:translate-x-0
            ${collapsed ? 'w-20' : 'w-64'}
          `}
        >
          <Sidebar
            isCollapsed={collapsed}
            setIsCollapsed={setIsCollapsed}
            isMobile={isMobile}
            closeMobileMenu={() => setIsMobileMenuOpen(false)}
          />
        </aside>

        {/* Mobile overlay backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-20 bg-gray-900/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="hidden md:block">
            <Topbar />
          </div>

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ isCollapsed, setIsCollapsed, isMobile, closeMobileMenu }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const { item: activeItem } = findNavItem(location.pathname);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback navigation if logout fails
      navigate('/admin/login');
    }
  };

  return (
    <div className="flex h-full flex-col bg-brand-950 text-white">
      {/* Logo and Toggle */}
      <div className={`flex h-16 shrink-0 items-center border-b border-white/10 ${isCollapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
        <Logo compact={isCollapsed} />
        {isMobile && (
          <button
            onClick={closeMobileMenu}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section, index) => (
          <div key={section.title || index} className={index > 0 ? 'mt-5' : ''}>
            {section.title && (isCollapsed ? (
              <div className="mx-3 mb-2 border-t border-white/10" />
            ) : (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                {section.title}
              </p>
            ))}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarLink
                  key={item.to}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={activeItem?.to === item.to}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse + Logout */}
      <div className="space-y-0.5 border-t border-white/10 p-3">
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Développer le menu' : 'Réduire le menu'}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white ${isCollapsed ? 'justify-center' : ''}`}
          >
            {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!isCollapsed && <span>Réduire le menu</span>}
          </button>
        )}
        <button
          onClick={handleLogout}
          title="Déconnexion"
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

// Sidebar Link Component
const SidebarLink = ({ item, isCollapsed, isActive }) => {
  const Icon = item.icon;
  return (
    <li>
      <Link
        to={item.to}
        title={isCollapsed ? item.label : undefined}
        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive ? 'bg-white/10 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'
        } ${isCollapsed ? 'justify-center' : ''}`}
      >
        {isActive && <span className="absolute inset-y-1.5 left-0 w-1 rounded-r bg-customGreen" />}
        <Icon size={18} className={isActive ? 'text-customGreen' : ''} />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
      </Link>
    </li>
  );
};

// Topbar Component
const Topbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { section, item } = findNavItem(location.pathname);
  const name = user?.Nom || 'Administrateur';
  const initials = name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500" aria-label="Fil d'Ariane">
        <Link to="dashboard" className="hover:text-gray-900">Back-office</Link>
        {section && (
          <>
            <ChevronRight size={14} className="text-gray-300" />
            <span>{section}</span>
          </>
        )}
        {item && item.to !== 'dashboard' && (
          <>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="font-medium text-gray-900">{item.label}</span>
          </>
        )}
      </nav>
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs capitalize text-gray-500">{user?.Role || 'Administrateur'}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
};

export default AdminLayout;
