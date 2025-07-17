import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ResetPassword = () => {
  const { token } = useParams();
  const { axios } = useAppContext();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'text-gray-400'
  });
  
  useEffect(() => {
    if (password) {
      checkPasswordStrength(password);
    }
  }, [password]);
  
  const checkPasswordStrength = (pass) => {
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (passwordStrength.score < 3) {
      setError('Please use a stronger password with uppercase, lowercase, numbers, and special characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post(`/api/user/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Please try again or request a new reset link.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text mb-2">Reset Password</h1>
          <p className="text-text-light mb-6">
            Create a new password for your account
          </p>
          
          {success ? (
            <div className="py-8">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-medium text-text mb-2">Password Reset Successful!</h2>
              <p className="text-text-light mb-6">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Link 
                to="/"
                className="inline-block bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md transition"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="border border-gray-300 bg-background text-primary rounded w-full p-2 focus:border-primary"
                  required
                />
                {password && (
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
              
              <div className="text-left">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="border border-gray-300 bg-background text-primary rounded w-full p-2 focus:border-primary"
                  required
                />
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
              
              {error && (
                <div className="text-red-600 text-sm text-left">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-hover text-white w-full py-2 rounded-md transition"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              
              <div className="text-sm text-text-light">
                <Link to="/" className="text-primary hover:underline">
                  Back to Home
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;