// src/components/ChatInput.jsx
import { useState, useEffect, useContext, useRef } from 'react';
import { Paperclip, Mic, Send, Smile } from 'lucide-react';
import { ChatContext } from '../contexts/ChatContext';

const ChatInput = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendMessage, setTypingStatus } = useContext(ChatContext);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  
  // Handle typing indicator
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (message && !isTyping) {
      setIsTyping(true);
      setTypingStatus(chatId, true);
    }
    
    if (message) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setTypingStatus(chatId, false);
      }, 2000);
    } else {
      setIsTyping(false);
      setTypingStatus(chatId, false);
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, setTypingStatus, chatId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (message.trim() === '') return;
    
    try {
      await sendMessage(chatId, message.trim());
      setMessage('');
      inputRef.current.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <div className="p-2 bg-white border-t border-signal-light-gray">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="flex items-center mx-2">
          <button 
            type="button"
            className="p-2 rounded-full hover:bg-signal-light-gray text-signal-gray"
          >
            <Paperclip size={20} />
          </button>
        </div>
        
        <div className="flex-1 bg-signal-light-gray rounded-full px-4 py-2 flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Message"
            className="flex-1 bg-transparent outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button 
            type="button"
            className="ml-2 text-signal-gray hover:text-signal-blue"
          >
            <Smile size={20} />
          </button>
        </div>
        
        <div className="flex items-center mx-2">
          {message.trim() === '' ? (
            <button 
              type="button"
              className="p-2 rounded-full hover:bg-signal-light-gray text-signal-gray"
            >
              <Mic size={20} />
            </button>
          ) : (
            <button 
              type="submit"
              className="p-2 rounded-full bg-signal-blue text-white hover:bg-signal-light-blue"
            >
              <Send size={20} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;