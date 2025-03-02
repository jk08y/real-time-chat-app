// src/components/TypingIndicator.jsx
import { useContext, useEffect } from 'react';
import { ChatContext } from '../contexts/ChatContext';
import useAuth from '../hooks/useAuth';

const TypingIndicator = ({ chatId }) => {
  const { currentUser } = useAuth();
  const { typingUsers, setTypingUsers, subscribeToTypingStatus } = useContext(ChatContext);

  useEffect(() => {
    if (!chatId || !currentUser) return;

    const unsubscribe = subscribeToTypingStatus(chatId, (typingStatus) => {
      setTypingUsers((prev) => ({
        ...prev,
        [chatId]: typingStatus
      }));
    });

    return () => {
      unsubscribe();
    };
  }, [chatId, currentUser, setTypingUsers, subscribeToTypingStatus]);

  const isOtherUserTyping = () => {
    if (
      !currentUser ||
      !typingUsers ||
      !typingUsers[chatId] ||
      Object.keys(typingUsers[chatId]).length === 0
    ) {
      return false;
    }

    // Check if any user other than the current user is typing
    for (const userId in typingUsers[chatId]) {
      if (userId !== currentUser.uid && typingUsers[chatId][userId]) {
        return true;
      }
    }

    return false;
  };

  if (!isOtherUserTyping()) {
    return null;
  }

  return (
    <div className="flex justify-start mb-2">
      <div className="message-bubble-received flex items-center py-2 px-4">
        <div className="typing-dot bg-signal-gray rounded-full h-2 w-2 mx-0.5"></div>
        <div className="typing-dot bg-signal-gray rounded-full h-2 w-2 mx-0.5"></div>
        <div className="typing-dot bg-signal-gray rounded-full h-2 w-2 mx-0.5"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;