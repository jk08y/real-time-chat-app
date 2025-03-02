// src/components/ChatHeader.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import Avatar from './Avatar';
import OnlineStatus from './OnlineStatus';

const ChatHeader = ({ chat }) => {
  const navigate = useNavigate();

  if (!chat || !chat.otherParticipant) {
    return (
      <div className="h-16 px-4 flex items-center justify-between bg-white border-b border-signal-light-gray">
        <div className="flex items-center">
          <button
            className="mr-2 p-2 rounded-full hover:bg-signal-light-gray"
            onClick={() => navigate('/chats')}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-10 w-10 bg-signal-light-gray rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-16 px-4 flex items-center justify-between bg-white border-b border-signal-light-gray">
      <div className="flex items-center">
        <button
          className="mr-2 p-2 rounded-full hover:bg-signal-light-gray"
          onClick={() => navigate('/chats')}
        >
          <ArrowLeft size={20} />
        </button>
        <Avatar
          src={chat.otherParticipant.photoURL}
          name={chat.otherParticipant.displayName}
          size="md"
          showStatus={true}
          online={false} // This will be updated by OnlineStatus component
        />
        <div className="ml-3">
          <h2 className="font-semibold">{chat.otherParticipant.displayName}</h2>
          <OnlineStatus userId={chat.otherParticipant.id} />
        </div>
      </div>
      
      <div className="flex items-center">
        <button className="p-2 rounded-full hover:bg-signal-light-gray mx-1">
          <Phone size={20} />
        </button>
        <button className="p-2 rounded-full hover:bg-signal-light-gray mx-1">
          <Video size={20} />
        </button>
        <button className="p-2 rounded-full hover:bg-signal-light-gray mx-1">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;