// src/components/NotificationBanner.jsx
import { useState, useEffect } from 'react';
import { X, Bell, Info, AlertCircle } from 'lucide-react';

const NotificationBanner = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose 
}) => {
  const [visible, setVisible] = useState(true);
  
  // Auto-close after duration
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };
  
  if (!visible) return null;
  
  // Set icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info size={16} className="text-white" />;
      case 'notification':
        return <Bell size={16} className="text-white" />;
      case 'error':
        return <AlertCircle size={16} className="text-white" />;
      default:
        return <Info size={16} className="text-white" />;
    }
  };
  
  // Set background color based on notification type
  const getBgColor = () => {
    switch (type) {
      case 'info':
        return 'bg-signal-blue';
      case 'notification':
        return 'bg-signal-green';
      case 'error':
        return 'bg-signal-red';
      default:
        return 'bg-signal-blue';
    }
  };
  
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${getBgColor()} text-white p-3 shadow-md`}>
      <div className="flex items-center">
        <div className="mr-2">
          {getIcon()}
        </div>
        <div className="flex-1 text-sm">
          {message}
        </div>
        <button 
          className="ml-2 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
          onClick={handleClose}
        >
          <X size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;