// src/components/BottomNavbar.jsx
import { NavLink } from 'react-router-dom';
import { MessageCircle, User, Settings } from 'lucide-react';

const BottomNavbar = () => {
  const navItems = [
    {
      to: '/chats',
      icon: <MessageCircle size={24} />,
      label: 'Chats'
    },
    {
      to: '/profile',
      icon: <User size={24} />,
      label: 'Profile'
    },
    {
      to: '/settings',
      icon: <Settings size={24} />,
      label: 'Settings'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-signal-light-gray shadow-sm z-10">
      <nav className="h-16 px-4 flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center ${
                isActive ? 'text-signal-blue' : 'text-signal-gray'
              }`
            }
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavbar;