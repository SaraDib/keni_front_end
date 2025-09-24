import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Home, User, Settings,FileText, LogOut, Menu, X,Activity,HelpCircle, Building, Phone, Briefcase, UserCheck, Clock, Users, Layers,ClipboardList ,Package} from 'lucide-react';
import Logo from './Logo';




// Import des composants de page
import Dashboard from '../pages/Dashboard';
import FAQ from '../pages/FAQ';
import HealthCenter from '../pages/HealthCenter';
import Contact from '../pages/Contact';
import JobOffers from '../pages/JobOffers';
import People from '../pages/People';
import Appointments from '../pages/Appointments';
import SettingsPage from '../pages/SettingsPage';
import UsersPage from '../pages/Users';
import Services from '../pages/Services';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    } else {
      setIsLoading(false);
    }
  }, [navigate]);
  
  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Set initial state based on screen size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Get the current page title based on the path
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    const titles = {
      'dashboard': 'Tableau de bord',
      'faq': 'FAQ',
      'health-center': 'Centre de santé',
      'contact': 'Contact',
      'job-offers': 'Offres d\'emploi',
      'people': 'L\'équipe',
      'appointments': 'Rendez-vous',
      'settings': 'Paramètres',
      'users': 'Utilisateurs',
      'services': 'Services'
    };
    return titles[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Appliquer la police Open Sans à toute l'application
  useEffect(() => {
    // Ajouter la police Open Sans depuis Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Appliquer la police à tout le document
    document.body.style.fontFamily = "'Open Sans', sans-serif";
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // If still loading, show nothing or a loading spinner
  if (isLoading) {
    return null; // This will render nothing while checking authentication
    // Alternatively, you could return a loading spinner:
    // return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {/* Mobile Navbar */}
      <div className="md:hidden bg-white shadow-sm z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <Logo size="small" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop (fixed) and Mobile (overlay) */}
        <aside 
          className={`
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0
            fixed md:relative z-30 md:z-auto
            h-full md:h-[calc(100vh-0px)]
            transition-transform duration-300 ease-in-out
            ${isCollapsed && !isMobile ? 'w-20' : 'w-64'}
          `}
        >
          <Sidebar 
            isCollapsed={isCollapsed && !isMobile} 
            setIsCollapsed={setIsCollapsed} 
            isMobile={isMobile}
            closeMobileMenu={() => setIsMobileMenuOpen(false)}
          />
        </aside>

        {/* Mobile overlay backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Desktop Navbar */}
          <div className="hidden md:block">
            <Navbar pageTitle={getPageTitle()} />
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ isCollapsed, setIsCollapsed, isMobile, closeMobileMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/admin/login');
  };

  return (
    <div className={`h-full bg-gray-800 text-white flex flex-col transition-all duration-300`}>
      {/* Logo and Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!isCollapsed || isMobile ? (
          <div className="flex items-center justify-between w-full">
            <Logo size="medium" />
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-2 rounded-md hover:bg-gray-700"
                aria-label="Réduire le menu"
              >
                <Menu size={20} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-2 rounded-md hover:bg-gray-700"
                aria-label="Développer le menu"
              >
                <Menu size={20} />
              </button>
            )}
          </div>
        )}
        
        {isMobile && (
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-md hover:bg-gray-700 absolute top-4 right-4"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-2">
          <SidebarLink 
            to="dashboard" 
            icon={<Home size={20} />} 
            label="Tableau de bord" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin' || location.pathname === '/admin/dashboard'}
          />
          
          {/* Section Services */}
          {(!isCollapsed || isMobile) && (
            <div className="mt-6 mb-2 px-3">
              <h3 className="text-xs uppercase text-gray-400 font-semibold">Services</h3>
            </div>
          )}
          
          <SidebarLink 
            to="services" 
            icon={<Layers size={20} />} 
            label="Gestion des Services" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/services'}
          />
          
          <SidebarLink 
            to="experts" 
            icon={<Activity size={20} />} 
            label="Section Experts" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/experts'}
          />

          <SidebarLink 
            to="about-us" 
            icon={<Activity size={20} />} 
            label="About Us Experts" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/about-us'}
          />

           <SidebarLink 
            to="updates" 
            icon={<FileText size={20} />} 
            label="Section Updates" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/updates'}
          />

          <SidebarLink 
            to="gestion-recettes" 
            icon={<ClipboardList size={20} />} 
            label="Gestion des Recettes" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/gestion-recettes'}
          />
          <SidebarLink 
            to="physiotherapie" 
            icon={<Package size={20} />} 
            label="Packs et Services" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/physiotherapie'}
          />
          
          {/* Section Pages */}
          {(!isCollapsed || isMobile) && (
            <div className="mt-6 mb-2 px-3">
              <h3 className="text-xs uppercase text-gray-400 font-semibold">Pages</h3>
            </div>
          )}
          
          <SidebarLink 
            to="faq" 
            icon={<HelpCircle size={20} />} 
            label="FAQ" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/faq'}
          />
          <SidebarLink 
            to="health-center" 
            icon={<Building size={20} />} 
            label="Centre de global health" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/health-center'}
          />
          <SidebarLink 
            to="contact" 
            icon={<Phone size={20} />} 
            label="Contact" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/contact'}
          />
          <SidebarLink 
            to="job-offers" 
            icon={<Briefcase size={20} />} 
            label="Offres d'emploi" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/job-offers'}
          />
          <SidebarLink 
            to="people" 
            icon={<UserCheck size={20} />} 
            label="L'équipe" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/people'}
          />
          <SidebarLink 
            to="appointments" 
            icon={<Clock size={20} />} 
            label="Rendez-vous" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/appointments'}
          />
          <SidebarLink 
            to="users" 
            icon={<Users size={20} />} 
            label="Utilisateurs" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/users'}
          />
          <SidebarLink 
            to="settings" 
            icon={<Settings size={20} />} 
            label="Paramètres" 
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isActive={location.pathname === '/admin/settings'}
          />
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700 mt-auto">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-700 text-red-300 hover:text-red-200 ${
            isCollapsed && !isMobile ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} />
          {(!isCollapsed || isMobile) && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

// Sidebar Link Component
const SidebarLink = ({ to, icon, label, isCollapsed, isMobile, isActive }) => (
  <li>
    <Link
      to={to}
      className={`flex items-center gap-3 p-2 rounded-md ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      } ${isCollapsed ? 'justify-center' : ''}`}
    >
      {icon}
      {(!isCollapsed || isMobile) && <span>{label}</span>}
    </Link>
  </li>
);

// Navbar Component
const Navbar = ({ pageTitle }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">Administrateur</div>
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminLayout;