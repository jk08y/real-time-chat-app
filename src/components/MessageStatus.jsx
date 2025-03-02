// src/components/MessageStatus.jsx
import { Check } from 'lucide-react';

const MessageStatus = ({ status }) => {
  // Possible statuses: 'sending', 'sent', 'delivered', 'read'
  
  if (status === 'sending') {
    return (
      <div className="w-3 h-3 rounded-full border-2 border-signal-gray border-t-transparent animate-spin"></div>
    );
  }
  
  if (status === 'sent') {
    return <Check size={14} className="text-signal-gray" />;
  }
  
  if (status === 'delivered') {
    return (
      <div className="flex">
        <Check size={14} className="text-signal-gray" />
        <Check size={14} className="text-signal-gray -ml-1" />
      </div>
    );
  }
  
  if (status === 'read') {
    return (
      <div className="flex">
        <Check size={14} className="text-signal-blue" />
        <Check size={14} className="text-signal-blue -ml-1" />
      </div>
    );
  }
  
  return null;
};

export default MessageStatus;