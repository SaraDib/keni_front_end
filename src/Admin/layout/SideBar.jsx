import { Link } from "react-router-dom";
import { Home, User, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="p-6">
          <h1 className="text-2xl font-semibold">Welcome to the Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <div
      className={`h-screen bg-gray-800 text-white p-4 flex flex-col justify-between 
      transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white"
      >
        <Menu size={24} />
        {!isCollapsed && <span className="text-lg font-bold">My App</span>}
      </button>

      {/* Sidebar Links */}
      <nav>
        <ul className="space-y-4">
          <SidebarLink to="/" icon={<Home size={24} />} label="Dashboard" isCollapsed={isCollapsed} />
          <SidebarLink to="/" icon={<User size={24} />} label="Profile" isCollapsed={isCollapsed} />
          <SidebarLink to="/" icon={<Settings size={24} />} label="Settings" isCollapsed={isCollapsed} />
        </ul>
      </nav>

      <SidebarLink to="/" icon={<LogOut size={24} />} label="Logout" isCollapsed={isCollapsed} />
    </div>
  );
};

// Sidebar Link Component
const SidebarLink = ({ to, icon, label, isCollapsed }) => (
  <li>
    <Link to={to} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </Link>
  </li>
);

// Navbar Component
const Navbar = () => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <button className="bg-gray-800 text-white px-4 py-2 rounded-md">Logout</button>
    </div>
  );
};

export default AppLayout;
