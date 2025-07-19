import React, { useState } from 'react'
import toast from 'react-hot-toast'

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative px-8 py-16 text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-primary font-medium text-sm">📧 Stay Updated</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Never Miss a Deal!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our newsletter and be the first to discover new updates, latest offers, and exclusive discounts on fresh produce.
          </p>
        </div>

        {/* Subscription Form */}
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-gray-900 placeholder-gray-500"
                disabled={isSubscribing}
              />
            </div>
            <button
              type="submit"
              disabled={isSubscribing}
              className={`px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 ${
                isSubscribing ? 'opacity-70 cursor-not-allowed' : 'hover:from-primary-dark hover:to-secondary-dark'
              }`}
            >
              {isSubscribing ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">🔥</span>
            </div>
            <span className="text-sm font-medium">Exclusive Deals</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">📦</span>
            </div>
            <span className="text-sm font-medium">New Products</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-sm">⚡</span>
            </div>
            <span className="text-sm font-medium">Flash Sales</span>
          </div>
        </div>

        {/* Privacy Notice */}
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          By subscribing, you agree to our{' '}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>{' '}
          and consent to receive updates. Unsubscribe anytime.
        </p>

        {/* Social proof */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-sm">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full border-2 border-white"></div>
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full border-2 border-white"></div>
          </div>
          <span>Join 1000+ happy subscribers</span>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter
