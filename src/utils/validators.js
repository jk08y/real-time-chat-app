// src/utils/validators.js

// Validate email format
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Validate password strength 
  export const validatePassword = (password) => {
    // Password must be at least 6 characters
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'Password must be at least 6 characters'
      };
    }
    
    return {
      isValid: true,
      message: ''
    };
  };
  
  // Validate display name
  export const validateDisplayName = (displayName) => {
    if (!displayName || displayName.trim() === '') {
      return {
        isValid: false,
        message: 'Display name is required'
      };
    }
    
    if (displayName.length < 3) {
      return {
        isValid: false,
        message: 'Display name must be at least 3 characters'
      };
    }
    
    return {
      isValid: true,
      message: ''
    };
  };
