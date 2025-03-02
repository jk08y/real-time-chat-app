// src/components/ChatListItem.jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { ChatContext } from '../contexts/ChatContext';
import useAuth from '../hooks/useAuth';
import { formatChatListDate } from '../utils/formatDate';
import useOnlineStatus from '../hooks/useOnlineStatus';

const ChatListItem = ({ chat }) => {
  const navigate = useNavigate();
  const { setSelectedChat } = useContext(ChatContext);
  const { currentUser } = useAuth();
  const { online } = useOnlineStatus(chat.otherParticipant.id);
  
  const handleClick = () => {
    setSelectedChat(chat);
    navigate(`/chat/${chat.id}`);
  };
  
  // Format last message preview
  const getLastMessagePreview = () => {
    if (!chat.lastMessage || !chat.lastMessage.text) {
      return 'No messages yet';
    }
    
    const isCurrentUserSender = chat.lastMessage.sentBy === currentUser?.uid;
    const prefix = isCurrentUserSender ? 'You: ' : '';
    
    // Truncate message if too long
    const MAX_LENGTH = 30;
    const text = chat.lastMessage.text;
    
    if (text.length <= MAX_LENGTH) {
      return `${prefix}${text}`;
    }
    
    return `${prefix}${text.substring(0, MAX_LENGTH)}...`;
  };
  
  // Format timestamp
  const getFormattedTime = () => {
    if (!chat.lastMessage || !chat.lastMessage.sentAt) {
      return '';
    }
    
    return formatChatListDate(chat.lastMessage.sentAt.toDate());
  };
  
  return (
    <div
      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
      onClick={handleClick}
    >
      <Avatar
        src={chat.otherParticipant.photoURL}
        name={chat.otherParticipant.displayName}
        size="lg"
        showStatus={true}
        online={online}
      />
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold truncate">
            {chat.otherParticipant.displayName}
          </h3>
          <span className="text-xs text-signal-gray ml-2 whitespace-nowrap">
            {getFormattedTime()}
          </span>
        </div>
        <p className="text-sm text-signal-gray truncate">
          {getLastMessagePreview()}
        </p>
      </div>
    </div>
  );
};

export default ChatListItem;