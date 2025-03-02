// src/components/ChatMessage.jsx
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { formatMessageDate } from '../utils/formatDate';
import MessageStatus from './MessageStatus';

const ChatMessage = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  
  // Check if current user is the sender
  const isSentByCurrentUser = message.sentBy === currentUser?.uid;
  
  // Get message time
  const getFormattedTime = () => {
    return formatMessageDate(message.sentAt);
  };
  
  return (
    <div
      className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`relative ${
          isSentByCurrentUser ? 'message-bubble-sent' : 'message-bubble-received'
        }`}
      >
        <div className="mb-1">{message.text}</div>
        <div className="flex items-center justify-end">
          <span className="text-xs text-signal-gray mr-1">
            {getFormattedTime()}
          </span>
          {isSentByCurrentUser && (
            <MessageStatus status={message.status} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;