import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import userImg from "../assets/user-2.png";
import toast from 'react-hot-toast';

const Account = () => {
  const { user, setUser, axios, isLoading, checkUserAuth } = useAppContext();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'text-gray-400'
  });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user, isLoading, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };
  
  const checkPasswordStrength = (pass) => {
    if (!pass) {
      setPasswordStrength({
        score: 0,
        message: '',
        color: 'text-gray-400'
      });
      return;
    }
    
    let score = 0;
    let message = '';
    let color = 'text-red-500';

    // Length check
    if (pass.length >= 8) score += 1;
    
    // Lowercase check
    if (/[a-z]/.test(pass)) score += 1;
    
    // Uppercase check
    if (/[A-Z]/.test(pass)) score += 1;
    
    // Number check
    if (/\d/.test(pass)) score += 1;
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    // Set message and color based on score
    if (score === 0 || score === 1) {
      message = 'Very weak';
      color = 'text-red-500';
    } else if (score === 2) {
      message = 'Weak';
      color = 'text-orange-500';
    } else if (score === 3) {
      message = 'Medium';
      color = 'text-yellow-500';
    } else if (score === 4) {
      message = 'Strong';
      color = 'text-blue-500';
    } else {
      message = 'Very strong';
      color = 'text-green-500';
    }

    setPasswordStrength({ score, message, color });
  };
  
  const updateProfile = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      const response = await axios.put('/api/user/update-profile', {
        name: formData.name
      });
      
      setUser(response.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const changePassword = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.currentPassword) {
      setError('Current password is required');
      return;
    }
    
    if (!formData.newPassword) {
      setError('New password is required');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (passwordStrength.score < 3) {
      setError('Please use a stronger password with uppercase, lowercase, numbers, and special characters');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      await axios.put('/api/user/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      toast.success('Password changed successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };
  
  const resendVerification = async () => {
    try {
      setLoading(true);
      await axios.post('/api/user/resend-verification', { email: user.email });
      toast.success('Verification email sent. Please check your inbox.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };
  
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text mb-8">My Account</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Account Header */}
          <div className="bg-primary/5 p-6 flex flex-col md:flex-row items-center gap-6 border-b border-gray-200">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
              <img 
                src={userImg} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-text">{user.name}</h2>
              <p className="text-text-light">{user.email}</p>
              {!user.isVerified && (
                <div className="mt-2 flex flex-col sm:flex-row items-center gap-2">
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Email not verified
                  </span>
                  <button 
                    onClick={resendVerification}
                    disabled={loading}
                    className="text-sm text-primary hover:underline"
                  >
                    {loading ? 'Sending...' : 'Resend verification email'}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-text-light hover:text-text'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'security'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-text-light hover:text-text'
                }`}
              >
                Security
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' ? (
              <form onSubmit={updateProfile} className="max-w-md">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md w-full p-2 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="border border-gray-300 rounded-md w-full p-2 bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-text-light mt-1">
                    Email address cannot be changed
                  </p>
                </div>
                
                {error && (
                  <div className="mb-4 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            ) : (
              <form onSubmit={changePassword} className="max-w-md">
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-text mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md w-full p-2 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-text mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md w-full p-2 focus:border-primary focus:outline-none"
                    required
                  />
                  {formData.newPassword && (
                    <div className="flex items-center mt-1">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            passwordStrength.score === 1 ? 'bg-red-500' : 
                            passwordStrength.score === 2 ? 'bg-orange-500' : 
                            passwordStrength.score === 3 ? 'bg-yellow-500' : 
                            passwordStrength.score === 4 ? 'bg-blue-500' : 
                            'bg-green-500'
                          }`} 
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs ml-2 ${passwordStrength.color}`}>
                        {passwordStrength.message}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md w-full p-2 focus:border-primary focus:outline-none"
                    required
                  />
                  {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>
                
                {error && (
                  <div className="mb-4 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition"
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;