// src/pages/Chat.jsx
import { useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import ChatHeader from '../components/ChatHeader';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import LoadingScreen from '../components/LoadingScreen';
import { ChatContext } from '../contexts/ChatContext';
import useAuth from '../hooks/useAuth';
import useMessages from '../hooks/useMessages';

const Chat = () => {
  const { id: chatId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { selectedChat, setSelectedChat } = useContext(ChatContext);
  const { messages, loading: messagesLoading } = useMessages(chatId);
  const messagesEndRef = useRef(null);
  
  // Fetch chat data if not already selected
  useEffect(() => {
    const fetchChat = async () => {
      if (!chatId || !currentUser) return;
      
      if (!selectedChat || selectedChat.id !== chatId) {
        try {
          const chatRef = doc(db, 'chats', chatId);
          const chatSnap = await getDoc(chatRef);
          
          if (chatSnap.exists()) {
            const chatData = chatSnap.data();
            
            // Ensure current user is a participant
            if (!chatData.participants.includes(currentUser.uid)) {
              navigate('/chats');
              return;
            }
            
            // Get other participant's info
            const otherParticipantId = chatData.participants.find(
              (participantId) => participantId !== currentUser.uid
            );
            
            const otherParticipantInfo = chatData.participantsInfo[otherParticipantId];
            
            setSelectedChat({
              id: chatSnap.id,
              ...chatData,
              otherParticipant: {
                id: otherParticipantId,
                ...otherParticipantInfo
              }
            });
          } else {
            navigate('/chats');
          }
        } catch (error) {
          console.error('Error fetching chat:', error);
          navigate('/chats');
        }
      }
    };
    
    fetchChat();
  }, [chatId, currentUser, selectedChat, setSelectedChat, navigate]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  if (!selectedChat || messagesLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="flex flex-col h-screen">
      <ChatHeader chat={selectedChat} />
      
      <div className="flex-1 overflow-y-auto p-4 chat-messages bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-signal-gray text-center">
              No messages yet. Send a message to start the conversation.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        <TypingIndicator chatId={chatId} />
        
        <div ref={messagesEndRef}></div>
      </div>
      
      <ChatInput chatId={chatId} />
    </div>
  );
};

export default Chat;