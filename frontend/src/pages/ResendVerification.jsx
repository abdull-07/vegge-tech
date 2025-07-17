import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { axios } = useAppContext();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('/api/user/resend-verification', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text mb-2">Resend Verification</h1>
          <p className="text-text-light mb-6">
            Enter your email address to receive a new verification link
          </p>
          
          {success ? (
            <div className="py-8">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-medium text-text mb-2">Email Sent!</h2>
              <p className="text-text-light mb-6">
                If your email exists in our system, a verification link has been sent to your inbox.
                Please check your email and follow the instructions to verify your account.
              </p>
              <Link 
                to="/"
                className="inline-block bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md transition"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="border border-gray-300 bg-background text-primary rounded w-full p-2 focus:border-primary"
                  required
                />
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
                {loading ? 'Sending...' : 'Send Verification Link'}
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

export default ResendVerification;