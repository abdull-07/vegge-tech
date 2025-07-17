import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const UserLogin = () => {
  const [state, setState] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'text-gray-400'
  });
  
  const { setShowUserLogin, setUser, axios } = useAppContext();

  // Password strength checker
  useEffect(() => {
    if (password && state === 'register') {
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

  const validateForm = () => {
    // Reset errors
    setError('');
    
    if (state === 'register') {
      // Name validation
      if (name.trim().length < 2) {
        setError('Name must be at least 2 characters long');
        return false;
      }
      
      if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
        setError('Name can only contain letters, spaces, hyphens, and apostrophes');
        return false;
      }
      
      // Password validation for registration
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
      
      if (passwordStrength.score < 3) {
        setError('Please use a stronger password with uppercase, lowercase, numbers, and special characters');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    
    // Email validation for both login and register
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    
    // Form validation
    if (!validateForm()) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let response;
      
      if (forgotPassword) {
        // Handle forgot password
        response = await axios.post('/api/user/forgot-password', { email });
        setSuccess(response.data.message);
        setLoading(false);
        return;
      }
      
      const url = state === 'login' ? '/api/user/login' : '/api/user/register';
      const body = state === 'login' 
        ? { email, password } 
        : { name, email, password };

      response = await axios.post(url, body);

      if (state === 'register') {
        setSuccess(response.data.message || 'Registration successful! Please check your email to verify your account.');
        // Don't close modal yet, show success message
        setLoading(false);
      } else {
        // For login, set user and close modal
        setUser(response.data.user);
        setShowUserLogin(false);
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong, please try again');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setForgotPassword(false);
  };

  const switchMode = (mode) => {
    setState(mode);
    resetForm();
  };

  return (
    <div onClick={() => setShowUserLogin(false)} className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/50 z-50">
      <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[400px] rounded-lg shadow-xl border border-gray-200 bg-background max-h-[90vh] overflow-y-auto">
        {success ? (
          // Success message view
          <div className="w-full text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-medium text-text mb-4">Success!</h2>
            <p className="text-text-light mb-6">{success}</p>
            {state === 'register' ? (
              <button 
                onClick={() => switchMode('login')} 
                className="bg-primary hover:bg-primary-hover text-white w-full py-2 rounded-md transition"
              >
                Proceed to Login
              </button>
            ) : (
              <button 
                onClick={() => setShowUserLogin(false)} 
                className="bg-primary hover:bg-primary-hover text-white w-full py-2 rounded-md transition"
              >
                Close
              </button>
            )}
          </div>
        ) : forgotPassword ? (
          // Forgot password view
          <form onSubmit={submitHandler} className="w-full">
            <p className="text-2xl font-medium m-auto text-text text-center mb-6">
              Reset Password
            </p>
            <p className="text-text-light text-sm mb-6 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <div className="w-full mb-4">
              <p className="text-text text-sm">Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter your email"
                className="border border-gray-300 bg-background text-primary rounded w-full p-2 mt-1 focus:border-primary"
                type="email"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <button 
              type="submit" 
              disabled={loading} 
              className="bg-primary hover:bg-primary-hover text-white w-full py-2 rounded-md transition mb-4"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <p className="text-sm text-text-light text-center">
              <span
                onClick={() => setForgotPassword(false)}
                className="text-primary font-medium cursor-pointer"
              >
                Back to login
              </span>
            </p>
          </form>
        ) : (
          // Login/Register view
          <form onSubmit={submitHandler} className="w-full">
            <p className="text-2xl font-medium m-auto text-text text-center mb-6">
              <span className="text-secondary">User</span> {state === 'login' ? 'Login' : 'Sign Up'}
            </p>

            {state === 'register' && (
              <div className="w-full mb-4">
                <p className="text-text text-sm">Full Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Enter your name"
                  className="border border-secondary/30 bg-background text-primary rounded w-full p-2 mt-1 focus:border-primary"
                  type="text"
                  required
                />
              </div>
            )}

            <div className="w-full mb-4">
              <p className="text-text text-sm">Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter your email"
                className="border border-gray-300 bg-background text-primary rounded w-full p-2 mt-1 focus:border-primary"
                type="email"
                required
              />
              {state === 'register' && (
                <p className="text-xs text-text-light mt-1">
                  Temporary or fake email addresses are not allowed
                </p>
              )}
            </div>

            <div className="w-full mb-4">
              <p className="text-text text-sm">Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder={state === 'register' ? "Create a strong password" : "Enter your password"}
                className="border border-gray-300 bg-background text-primary rounded w-full p-2 mt-1 focus:border-primary"
                type="password"
                required
              />
              {state === 'register' && password && (
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

            {state === 'register' && (
              <div className="w-full mb-4">
                <p className="text-text text-sm">Confirm Password</p>
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  placeholder="Confirm your password"
                  className="border border-gray-300 bg-background text-primary rounded w-full p-2 mt-1 focus:border-primary"
                  type="password"
                  required
                />
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
            )}

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            {state === 'login' && (
              <p className="text-sm text-text-light mb-4 text-right">
                <span
                  onClick={() => setForgotPassword(true)}
                  className="text-primary font-medium cursor-pointer"
                >
                  Forgot password?
                </span>
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="bg-primary hover:bg-primary-hover text-white w-full py-2 rounded-md transition mb-4"
            >
              {loading 
                ? (state === 'register' ? 'Creating Account...' : 'Logging in...') 
                : (state === 'register' ? 'Create Account' : 'Login')}
            </button>
            
            <p className="text-sm text-text-light text-center">
              {state === 'register' ? (
                <>
                  Already have an account?{' '}
                  <span
                    onClick={() => switchMode('login')}
                    className="text-primary font-medium cursor-pointer"
                  >
                    Login here
                  </span>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <span
                    onClick={() => switchMode('register')}
                    className="text-secondary font-medium cursor-pointer"
                  >
                    Sign up here
                  </span>
                </>
              )}
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserLogin;