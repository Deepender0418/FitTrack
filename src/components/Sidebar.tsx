import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Target, 
  Dumbbell, 
  User, 
  LogOut,
  X 
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMobile && open && !target.closest('.sidebar')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, open, setOpen]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Goals', path: '/goals', icon: <Target size={20} /> },
    { name: 'Workouts', path: '/workouts', icon: <Dumbbell size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || open) && (
          <motion.div
            className={`sidebar fixed lg:relative z-40 h-full bg-white shadow-lg overflow-y-auto ${
              isMobile ? 'w-64' : 'w-64'
            }`}
            initial={isMobile ? { x: -264 } : { x: 0 }}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -264 } : undefined}
            transition={{ duration: 0.3 }}
          >
            {/* Mobile close button */}
            {isMobile && (
              <button
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </button>
            )}

            {/* App branding */}
            <div className="flex items-center p-6 border-b">
              <Dumbbell size={24} className="text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">FitTrack</h1>
            </div>

            {/* User info */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                  onClick={() => isMobile && setOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}

              <button
                className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={handleLogout}
              >
                <span className="mr-3">
                  <LogOut size={20} />
                </span>
                <span>Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;