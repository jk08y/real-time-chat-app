// src/hooks/useOnlineStatus.js
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { formatDistanceToNow } from 'date-fns';

const useOnlineStatus = (userId) => {
  const [online, setOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!userId) {
      setOnline(false);
      setLastSeen(null);
      setLoading(false);
      return;
    }
    
    const userRef = doc(db, 'users', userId);
    
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setOnline(userData.online || false);
        
        if (userData.lastSeen) {
          const lastSeenDate = userData.lastSeen.toDate();
          const formattedLastSeen = formatDistanceToNow(lastSeenDate, { addSuffix: true });
          setLastSeen(formattedLastSeen);
        } else {
          setLastSeen(null);
        }
      } else {
        setOnline(false);
        setLastSeen(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [userId]);
  
  return { online, lastSeen, loading };
};

export default useOnlineStatus;