// src/pages/Chats.jsx
import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Search, Plus, User } from 'lucide-react';
import ChatList from '../components/ChatList';
import Avatar from '../components/Avatar';
import BottomNavbar from '../components/BottomNavbar';
import useAuth from '../hooks/useAuth';
import { ChatContext } from '../contexts/ChatContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const Chats = () => {
  const { currentUser } = useAuth();
  const { createOrGetChat } = useContext(ChatContext);
  const navigate = useNavigate();
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('displayName', '>=', searchQuery),
        where('displayName', '<=', searchQuery + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        
        // Don't include current user
        if (userData.uid !== currentUser.uid) {
          users.push(userData);
        }
      });
      
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };
  
  const handleStartChat = async (userId) => {
    try {
      const chat = await createOrGetChat(userId);
      if (chat) {
        navigate(`/chat/${chat.id}`);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="p-4 flex items-center justify-between border-b border-signal-light-gray">
        <h1 className="text-xl font-bold">Chats</h1>
        <button 
          className="p-2 rounded-full hover:bg-signal-light-gray"
          onClick={() => setShowNewChat(!showNewChat)}
        >
          <Plus size={24} className={showNewChat ? 'text-signal-blue' : ''} />
        </button>
      </div>
      
      {showNewChat && (
        <div className="p-4 border-b border-signal-light-gray">
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for users"
                className="w-full bg-signal-light-gray rounded-full pl-10 pr-4 py-2 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-signal-gray"
              />
            </div>
            <button 
              className="ml-2 px-4 py-2 bg-signal-blue text-white rounded-full text-sm font-medium"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          
          {searching ? (
            <div className="mt-4 flex flex-col space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-signal-light-gray rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-signal-light-gray rounded w-1/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="mt-4 flex flex-col divide-y divide-signal-light-gray">
              {searchResults.map((user) => (
                <div 
                  key={user.uid}
                  className="py-2 flex items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => handleStartChat(user.uid)}
                >
                  <Avatar
                    src={user.photoURL}
                    name={user.displayName}
                    size="md"
                  />
                  <div className="ml-3">
                    <h3 className="font-semibold">{user.displayName}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery && !searching && (
            <div className="mt-4 text-center text-signal-gray">
              No users found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <ChatList />
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Chats;