// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { validateEmail } from '../utils/validators';
import NotificationBanner from '../components/NotificationBanner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/chats');
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Failed to sign in. Please try again.';
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {error && (
        <NotificationBanner
          message={error}
          type="error"
          onClose={() => setError('')}
        />
      )}
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="text-signal-blue mb-4">
            <MessageSquare size={64} />
          </div>
          <h1 className="text-2xl font-bold text-signal-dark">Sign In</h1>
          <p className="text-signal-gray mt-2">Welcome back to Signal Clone</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-signal-dark mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-signal-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-signal-blue"
                placeholder="Your email"
                disabled={loading}
              />
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-signal-gray" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-signal-dark mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-signal-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-signal-blue"
                placeholder="Your password"
                disabled={loading}
              />
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-signal-gray" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-signal-gray"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white font-medium ${
              loading
                ? 'bg-signal-light-blue cursor-not-allowed'
                : 'bg-signal-blue hover:bg-signal-light-blue'
            }`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-signal-gray">
            Don't have an account?{' '}
            <Link to="/signup" className="text-signal-blue font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;