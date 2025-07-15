import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Camera, 
  Search, 
  Calendar, 
  Settings, 
  User,
  ClipboardList,
  BarChart,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, hasCompletedAssessment } = useAuth();
  
  const navItems = [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { 
      label: 'Skin Assessment', 
      icon: <ClipboardList size={20} />, 
      path: '/dashboard/assessment',
      badge: !hasCompletedAssessment ? 'Start Here' : 'Complete'
    },
    { label: 'Facial Analysis', icon: <Camera size={20} />, path: '/dashboard/analysis' },
    { label: 'Progress Tracker', icon: <BarChart size={20} />, path: '/dashboard/progress' },
    { label: 'Ingredient Checker', icon: <Search size={20} />, path: '/dashboard/ingredients' },
    { label: 'Routine Generator', icon: <Calendar size={20} />, path: '/dashboard/routine' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  return (
    <aside className="bg-white border-r border-gray-200 w-64 h-screen fixed top-0 left-0 overflow-y-auto">
      <div className="py-6 px-4">
        <div className="flex items-center justify-center mb-8">
          <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            CARE CANVAS
          </span>
        </div>
        
        {/* User profile */}
        <div className="flex items-center px-4 py-3 mb-6 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User size={20} className="text-primary-600" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `
                group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md
                ${isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </div>
              {item.badge && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  !hasCompletedAssessment && item.path.includes('assessment')
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;