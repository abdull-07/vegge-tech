import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const VerifyEmail = () => {
  const { token } = useParams();
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/user/verify-email/${token}`);
        setSuccess(true);
        setError('');
      } catch (err) {
        setSuccess(false);
        setError(err.response?.data?.message || 'Verification failed. Please try again or request a new verification link.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, axios]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text mb-6">Email Verification</h1>

          {loading ? (
            <div className="py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-text-light">Verifying your email...</p>
            </div>
          ) : success ? (
            <div className="py-8">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-medium text-text mb-2">Verification Successful!</h2>
              <p className="text-text-light mb-6">
                Your email has been successfully verified. You can now log in to your account.
              </p>
              <Link
                to="/"
                className="inline-block bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md transition"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <div className="py-8">
              <div className="text-red-500 text-6xl mb-4">✗</div>
              <h2 className="text-2xl font-medium text-text mb-2">Verification Failed</h2>
              <p className="text-text-light mb-6">
                {error || 'The verification link is invalid or has expired.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-200 hover:bg-gray-300 text-text px-6 py-2 rounded-md transition"
                >
                  Go to Home
                </button>
                <Link
                  to="/resend-verification"
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md transition"
                >
                  Resend Verification
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;