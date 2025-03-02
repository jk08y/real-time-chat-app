// src/pages/Profile.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Edit2, 
  LogOut, 
  Save,
  X,
  User as UserIcon
} from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage, auth } from '../firebase/firebase';
import useAuth from '../hooks/useAuth';
import Avatar from '../components/Avatar';
import BottomNavbar from '../components/BottomNavbar';
import NotificationBanner from '../components/NotificationBanner';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const handleUpdateProfile = async () => {
    if (!displayName.trim() || displayName === currentUser.displayName) {
      setIsEditing(false);
      return;
    }
    
    setLoading(true);
    
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      
      // Update Firestore profile
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: displayName
      });
      
      setNotification({
        message: 'Profile updated successfully',
        type: 'info'
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        message: 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setNotification({
        message: 'Please select an image file',
        type: 'error'
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setNotification({
        message: 'Image size too large. Please select an image smaller than 5MB',
        type: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `avatars/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update Auth profile
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL
      });
      
      // Update Firestore profile
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL
      });
      
      setNotification({
        message: 'Profile picture updated successfully',
        type: 'info'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setNotification({
        message: 'Failed to update profile picture',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    setLoading(true);
    
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      setNotification({
        message: 'Failed to log out',
        type: 'error'
      });
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {notification && (
        <NotificationBanner
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="p-4 bg-white border-b border-signal-light-gray">
        <h1 className="text-xl font-bold">Profile</h1>
      </div>
      
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative">
              {currentUser?.photoURL ? (
                <Avatar
                  src={currentUser.photoURL}
                  name={currentUser.displayName}
                  size="xl"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-signal-light-blue text-white flex items-center justify-center">
                  <UserIcon size={32} />
                </div>
              )}
              
              <label className="absolute bottom-0 right-0 bg-signal-blue text-white rounded-full p-2 cursor-pointer">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={loading}
                />
              </label>
            </div>
            
            <div className="mt-4 text-center">
              {isEditing ? (
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="border border-signal-light-gray rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-signal-blue"
                    disabled={loading}
                  />
                  <button
                    className="ml-2 text-signal-green"
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    <Save size={18} />
                  </button>
                  <button
                    className="ml-2 text-signal-red"
                    onClick={() => {
                      setDisplayName(currentUser?.displayName || '');
                      setIsEditing(false);
                    }}
                    disabled={loading}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center mt-2">
                  <h2 className="text-lg font-semibold">{currentUser?.displayName}</h2>
                  <button
                    className="ml-2 text-signal-gray hover:text-signal-blue"
                    onClick={() => setIsEditing(true)}
                    disabled={loading}
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
              <p className="text-signal-gray text-sm mt-1">{currentUser?.email}</p>
            </div>
          </div>
          
          <button
            className="w-full flex items-center justify-center text-signal-red py-2 border border-signal-red rounded-lg mt-4"
            onClick={handleLogout}
            disabled={loading}
          >
            <LogOut size={18} className="mr-2" />
            {loading ? 'Logging out...' : 'Sign Out'}
          </button>
        </div>
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Profile;