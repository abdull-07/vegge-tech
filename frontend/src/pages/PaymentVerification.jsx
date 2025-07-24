import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function PaymentVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { axios, clearCart } = useAppContext();
  
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Verifying your payment...');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get query parameters from URL
        const queryParams = new URLSearchParams(location.search);
        const paymentProvider = queryParams.get('provider') || 'unknown';
        const responseCode = queryParams.get('pp_ResponseCode') || queryParams.get('responseCode');
        const txnRefNo = queryParams.get('pp_TxnRefNo') || queryParams.get('orderRefNum');
        
        // Get pending order from localStorage
        const pendingOrderData = localStorage.getItem('pendingOrder');
        
        if (!pendingOrderData) {
          setStatus('error');
          setMessage('No pending order found. Please try again.');
          return;
        }
        
        const pendingOrder = JSON.parse(pendingOrderData);
        setOrderDetails(pendingOrder);
        
        // Check if payment was successful
        if (responseCode === '000' || responseCode === 'SUCCESS') {
          // Payment successful, place the order
          const orderData = {
            ...pendingOrder,
            paymentId: txnRefNo,
            amount: pendingOrder.amount || 0,
            paymentType: paymentProvider === 'jazzcash' ? 'JazzCash' : 'Easypaisa'
          };
          
          // Submit order to backend
          const response = await axios.post('/api/order/online', orderData);
          
          if (response.data.message) {
            // Order placed successfully
            setStatus('success');
            setMessage('Payment successful! Your order has been placed.');
            
            // Clear cart and pending order
            await clearCart();
            localStorage.removeItem('pendingOrder');
            
            // Show success toast
            toast.success('Payment successful! Your order has been placed.');
            
            // Redirect to orders page after 3 seconds
            setTimeout(() => {
              navigate('/my-orders');
            }, 3000);
          } else {
            throw new Error('Failed to place order');
          }
        } else {
          // Payment failed
          setStatus('error');
          setMessage('Payment failed or was cancelled. Please try again.');
          toast.error('Payment failed or was cancelled.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'Payment verification failed. Please contact support.');
        toast.error('Payment verification failed.');
      }
    };
    
    verifyPayment();
  }, [location, axios, clearCart, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {status === 'processing' && (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="bg-green-50 p-4 rounded-lg text-left mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Order Summary</h3>
              <p className="text-sm text-gray-600">Your order has been placed successfully. You will receive a confirmation email shortly.</p>
            </div>
            <button 
              onClick={() => navigate('/my-orders')} 
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              View My Orders
            </button>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/checkout')} 
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <button 
                onClick={() => navigate('/cart')} 
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Return to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentVerification;