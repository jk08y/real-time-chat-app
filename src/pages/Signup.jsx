// src/pages/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { validateEmail, validatePassword, validateDisplayName } from '../utils/validators';
import NotificationBanner from '../components/NotificationBanner';

const Signup = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!displayName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    const displayNameValidation = validateDisplayName(displayName);
    if (!displayNameValidation.isValid) {
      setError(displayNameValidation.message);
      return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      await signup(email, password, displayName);
      navigate('/chats');
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use. Please use a different email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
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
          <h1 className="text-2xl font-bold text-signal-dark">Create Account</h1>
          <p className="text-signal-gray mt-2">Join Signal Clone today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-signal-dark mb-1">
              Display Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-signal-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-signal-blue"
                placeholder="Your name"
                disabled={loading}
              />
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-signal-gray" />
            </div>
          </div>
          
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
                placeholder="Create a password"
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
          
          <div>
            <label className="block text-sm font-medium text-signal-dark mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-signal-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-signal-blue"
                placeholder="Confirm your password"
                disabled={loading}
              />
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-signal-gray" />
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-signal-gray">
            Already have an account?{' '}
            <Link to="/login" className="text-signal-blue font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;