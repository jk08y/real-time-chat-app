// src/contexts/ChatContext.jsx
import { createContext, useState, useContext } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { AuthContext } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  
  // Create or get a chat with another user
  const createOrGetChat = async (otherUserId) => {
    if (!currentUser || !otherUserId) return null;
    
    // Check if a chat already exists between these users
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef, 
      where('participants', 'array-contains', currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    let existingChat = null;
    
    querySnapshot.forEach((doc) => {
      const chatData = doc.data();
      if (chatData.participants.includes(otherUserId)) {
        existingChat = { id: doc.id, ...chatData };
      }
    });
    
    if (existingChat) {
      return existingChat;
    }
    
    // Get the other user's data
    const otherUserRef = doc(db, 'users', otherUserId);
    const otherUserSnap = await getDoc(otherUserRef);
    
    if (!otherUserSnap.exists()) {
      throw new Error('User not found');
    }
    
    const otherUserData = otherUserSnap.data();
    
    // Create a new chat
    const chatId = uuidv4();
    const chatRef = doc(db, 'chats', chatId);
    
    const chatData = {
      id: chatId,
      participants: [currentUser.uid, otherUserId],
      participantsInfo: {
        [currentUser.uid]: {
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        },
        [otherUserId]: {
          displayName: otherUserData.displayName,
          photoURL: otherUserData.photoURL
        }
      },
      lastMessage: {
        text: '',
        sentAt: null,
        sentBy: ''
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(chatRef, chatData);
    
    return { id: chatId, ...chatData };
  };
  
  // Send a message
  const sendMessage = async (chatId, text) => {
    if (!currentUser || !chatId) return null;
    
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const messageId = uuidv4();
    
    const messageData = {
      id: messageId,
      text,
      sentBy: currentUser.uid,
      sentAt: serverTimestamp(),
      read: {},
      status: 'sent'
    };
    
    // Set the message as unread for all participants except the sender
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);
    
    if (chatSnap.exists()) {
      const chatData = chatSnap.data();
      const participants = chatData.participants;
      
      participants.forEach((participant) => {
        if (participant !== currentUser.uid) {
          messageData.read[participant] = false;
        }
      });
    }
    
    // Add message to Firestore
    await setDoc(doc(messagesRef, messageId), messageData);
    
    // Update last message in chat
    await updateDoc(chatRef, {
      lastMessage: {
        text,
        sentAt: serverTimestamp(),
        sentBy: currentUser.uid
      },
      updatedAt: serverTimestamp()
    });
    
    return messageData;
  };
  
  // Mark message as read
  const markMessageAsRead = async (chatId, messageId) => {
    if (!currentUser || !chatId || !messageId) return;
    
    const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
    const messageSnap = await getDoc(messageRef);
    
    if (messageSnap.exists()) {
      const messageData = messageSnap.data();
      const readStatus = { ...messageData.read };
      
      if (messageData.sentBy !== currentUser.uid) {
        readStatus[currentUser.uid] = true;
        
        await updateDoc(messageRef, {
          read: readStatus,
          status: 'read'
        });
      }
    }
  };
  
  // Set typing status
  const setTypingStatus = async (chatId, isTyping) => {
    if (!currentUser || !chatId) return;
    
    const typingRef = doc(db, 'typing', chatId);
    const typingSnap = await getDoc(typingRef);
    
    if (isTyping) {
      if (typingSnap.exists()) {
        await updateDoc(typingRef, {
          [currentUser.uid]: true,
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(typingRef, {
          [currentUser.uid]: true,
          updatedAt: serverTimestamp()
        });
      }
    } else {
      if (typingSnap.exists()) {
        await updateDoc(typingRef, {
          [currentUser.uid]: false,
          updatedAt: serverTimestamp()
        });
      }
    }
  };
  
  // Get typing status
  const subscribeToTypingStatus = (chatId, callback) => {
    if (!chatId) return () => {};
    
    const typingRef = doc(db, 'typing', chatId);
    
    return onSnapshot(typingRef, (snapshot) => {
      if (snapshot.exists()) {
        const typingData = snapshot.data();
        delete typingData.updatedAt;
        callback(typingData);
      } else {
        callback({});
      }
    });
  };
  
  const value = {
    selectedChat,
    setSelectedChat,
    createOrGetChat,
    sendMessage,
    markMessageAsRead,
    setTypingStatus,
    subscribeToTypingStatus,
    typingUsers,
    setTypingUsers
  };
  
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};