// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="text-6xl font-bold text-signal-blue mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-signal-dark mb-4">Page Not Found</h2>
      <p className="text-signal-gray mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="flex items-center text-signal-blue font-medium hover:underline"
      >
        <ArrowLeft size={16} className="mr-1" />
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;