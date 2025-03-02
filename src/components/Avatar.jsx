// src/components/Avatar.jsx
import { User } from 'lucide-react';

const Avatar = ({ src, name, size = 'md', showStatus = false, online = false }) => {
  // Size variants
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Calculate initials from name
  const getInitials = () => {
    if (!name) return '';
    
    const names = name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="relative">
      {src ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          className={`${sizeClasses[size]} rounded-full object-cover border border-signal-light-gray`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-signal-light-blue text-white`}
        >
          {name ? (
            <span className="font-semibold">{getInitials()}</span>
          ) : (
            <User size={parseInt(sizeClasses[size].split('w-')[1]) / 2} />
          )}
        </div>
      )}
      
      {showStatus && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${online ? 'bg-signal-green' : 'bg-signal-gray'}`}></div>
      )}
    </div>
  );
};

export default Avatar;