import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const TestEmail = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { axios } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setResult({
        success: false,
        message: 'Please enter an email address'
      });
      return;
    }
    
    try {
      setLoading(true);
      setResult(null);
      
      const response = await axios.post('/api/test/email', { email });
      
      setResult({
        success: true,
        message: response.data.message,
        details: response.data
      });
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Failed to send test email',
        details: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-text mb-6">Test Email Service</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to test"
              className="border border-gray-300 rounded-md w-full p-2 focus:border-primary focus:outline-none"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition w-full"
          >
            {loading ? 'Sending...' : 'Send Test Email'}
          </button>
        </form>
        
        {result && (
          <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-medium">{result.message}</p>
            {result.details && (
              <pre className="mt-2 text-xs overflow-auto max-h-40">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            )}
          </div>
        )}
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-text mb-4">Email Verification Instructions</h2>
          <ol className="list-decimal pl-5 space-y-2 text-text-light">
            <li>Enter your email address in the field above</li>
            <li>Click "Send Test Email" to send a verification email</li>
            <li>Check your inbox for the verification email</li>
            <li>Click the verification link in the email</li>
            <li>You should be redirected to the verification success page</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestEmail;