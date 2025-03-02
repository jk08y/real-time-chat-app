// src/components/ChatList.jsx
import { useState } from 'react';
import { Search, PlusCircle } from 'lucide-react';
import ChatListItem from './ChatListItem';
import useChats from '../hooks/useChats';

const ChatList = () => {
  const { chats, loading } = useChats();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter chats by search query
  const filteredChats = chats.filter(chat => 
    chat.otherParticipant.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex flex-col h-full pb-16">
      <div className="p-4 bg-white border-b border-signal-light-gray">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-signal-light-gray rounded-full pl-10 pr-4 py-2 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-signal-gray" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col space-y-4 p-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-signal-light-gray rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-signal-light-gray rounded w-1/3 animate-pulse"></div>
                  <div className="h-3 bg-signal-light-gray rounded w-1/2 mt-2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="text-signal-gray mb-2">No chats found</div>
            {searchQuery ? (
              <button 
                className="text-signal-blue flex items-center"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </button>
            ) : (
              <button className="text-signal-blue flex items-center">
                <PlusCircle size={18} className="mr-1" />
                Start a new chat
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-signal-light-gray">
            {filteredChats.map(chat => (
              <ChatListItem key={chat.id} chat={chat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;