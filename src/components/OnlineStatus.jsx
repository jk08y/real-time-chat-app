// src/components/OnlineStatus.jsx
import useOnlineStatus from '../hooks/useOnlineStatus';

const OnlineStatus = ({ userId }) => {
  const { online, lastSeen, loading } = useOnlineStatus(userId);
  
  if (loading) {
    return (
      <span className="text-xs text-signal-gray animate-pulse">
        Loading status...
      </span>
    );
  }
  
  if (online) {
    return (
      <span className="text-xs text-signal-green">
        online
      </span>
    );
  }
  
  if (lastSeen) {
    return (
      <span className="text-xs text-signal-gray">
        {lastSeen}
      </span>
    );
  }
  
  return (
    <span className="text-xs text-signal-gray">
      offline
    </span>
  );
};

export default OnlineStatus;