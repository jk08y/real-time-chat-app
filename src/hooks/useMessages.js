// src/hooks/useMessages.js
import { useState, useEffect, useContext } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { ChatContext } from '../contexts/ChatContext';
import useAuth from './useAuth';

const useMessages = (chatId, limitCount = 50) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { markMessageAsRead } = useContext(ChatContext);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(
      messagesRef,
      orderBy('sentAt', 'desc'),
      limit(limitCount)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = [];
      
      snapshot.forEach((doc) => {
        const messageData = doc.data();
        
        // Mark message as read if it's not sent by current user
        if (
          currentUser && 
          messageData.sentBy !== currentUser.uid && 
          messageData.read && 
          messageData.read[currentUser.uid] === false
        ) {
          markMessageAsRead(chatId, doc.id);
        }
        
        messageList.push({
          id: doc.id,
          ...messageData,
          sentAt: messageData.sentAt ? messageData.sentAt.toDate() : new Date()
        });
      });
      
      // Sort messages by date ascending
      messageList.sort((a, b) => a.sentAt - b.sentAt);
      
      setMessages(messageList);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [chatId, currentUser, markMessageAsRead, limitCount]);
  
  return { messages, loading };
};

export default useMessages;