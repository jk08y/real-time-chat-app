// src/components/LoadingScreen.jsx
import { MessageSquare } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="text-signal-blue mb-4">
        <MessageSquare size={64} />
      </div>
      <h1 className="text-2xl font-bold mb-2 text-signal-dark">Signal Clone</h1>
      <div className="mt-4 w-12 h-1 bg-signal-light-gray rounded-full overflow-hidden">
        <div className="h-full bg-signal-blue animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;