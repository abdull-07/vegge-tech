import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function Checkout() {
  const navigate = useNavigate();
  const { user, cartItems, getTotalCartPrice, axios, clearCart } = useAppContext();
  
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [realCartItems, setRealCartItems] = useState([]);
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',

    // Delivery Address
    address: '',
    city: '',
    zipCode: '',
    deliveryInstructions: '',

    // Payment Information
    paymentMethod: 'jazzcash',
    jazzCashNumber: '',
    easypaisaNumber: '',

    // Order Options
    deliveryTime: 'standard',
    specialRequests: ''
  });

  // Calculate order totals
  const subtotal = getTotalCartPrice();
  const deliveryFee = formData.deliveryTime === 'express' ? 50 : 0;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + deliveryFee + tax;

  // Get real cart items from context
  useEffect(() => {
    setIsVisible(true);
    
    // Get cart items from the app context
    if (Object.keys(cartItems).length > 0) {
      // Convert cart items to array format needed for checkout
      const items = Object.entries(cartItems).map(([productId, quantity]) => ({
        productId,
        quantity
      }));
      setRealCartItems(items);
    } else {
      // Redirect to cart if no items
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  // Check if user is logged in and verified
  useEffect(() => {
    if (!user) {
      toast.error("Please login to proceed with checkout");
      navigate('/cart');
    } else if (!user.isVerified) {
      toast.error("Please verify your email before checkout");
      navigate('/cart');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentError('');
    
    try {
      // Prepare order data
      const orderData = {
        items: realCartItems,
        address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          streetAddress: formData.address,
          phoneNumber: formData.phone,
          city: formData.city,
          zipCode: formData.zipCode,
          deliveryInstructions: formData.deliveryInstructions
        },
        deliveryTime: formData.deliveryTime
      };
      
      // Process payment based on selected method
      if (formData.paymentMethod === 'jazzcash') {
        // Validate JazzCash number
        if (!formData.jazzCashNumber || !/^03\d{2}-?\d{7}$/.test(formData.jazzCashNumber)) {
          toast.error('Please enter a valid JazzCash mobile number (03XX-XXXXXXX)');
          setIsLoading(false);
          return;
        }
        
        // Send payment request to JazzCash API
        const paymentData = {
          amount: total,
          userPhone: formData.jazzCashNumber.replace(/-/g, ''),
          email: formData.email
        };
        
        toast.loading('Processing JazzCash payment...');
        
        const response = await axios.post('/api/payment/jazzcash', paymentData);
        
        if (response.data.redirectUrl) {
          // Store order data in localStorage for retrieval after payment
          localStorage.setItem('pendingOrder', JSON.stringify(orderData));
          
          // Redirect to JazzCash payment page
          window.location.href = response.data.redirectUrl;
          return;
        } else {
          throw new Error('Payment initialization failed');
        }
      } 
      else if (formData.paymentMethod === 'easypaisa') {
        // Validate Easypaisa number
        if (!formData.easypaisaNumber || !/^03\d{2}-?\d{7}$/.test(formData.easypaisaNumber)) {
          toast.error('Please enter a valid Easypaisa mobile number (03XX-XXXXXXX)');
          setIsLoading(false);
          return;
        }
        
        // Send payment request to Easypaisa API
        const paymentData = {
          amount: total,
          userPhone: formData.easypaisaNumber.replace(/-/g, ''),
          email: formData.email
        };
        
        toast.loading('Processing Easypaisa payment...');
        
        const response = await axios.post('/api/payment/easypaisa', paymentData);
        
        if (response.data.redirectUrl) {
          // Store order data in localStorage for retrieval after payment
          localStorage.setItem('pendingOrder', JSON.stringify(orderData));
          
          // Redirect to Easypaisa payment page
          window.location.href = response.data.redirectUrl;
          return;
        } else {
          throw new Error('Payment initialization failed');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Payment processing failed. Please try again.');
      setPaymentError(error.response?.data?.message || 'Payment processing failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className={`bg-white shadow-sm border-b transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Checkout</h1>
            <Link to="/cart" className="text-primary hover:text-primary/80 transition-colors">
              ← Back to Cart
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${currentStep >= step
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                    }`}>
                    {step}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${currentStep >= step ? 'text-primary' : 'text-gray-500'
                    }`}>
                    {step === 1 ? 'Information' : step === 2 ? 'Delivery' : 'Payment'}
                  </span>
                  {step < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-4"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Information */}
              {currentStep === 2 && (
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Delivery Information</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="deliveryTime"
                            value="standard"
                            checked={formData.deliveryTime === 'standard'}
                            onChange={handleInputChange}
                            className="text-primary focus:ring-primary"
                          />
                          <div className="ml-3">
                            <div className="font-medium text-gray-800">Standard Delivery</div>
                            <div className="text-sm text-gray-600">2-4 hours • Free</div>
                          </div>
                        </label>
                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="deliveryTime"
                            value="express"
                            checked={formData.deliveryTime === 'express'}
                            onChange={handleInputChange}
                            className="text-primary focus:ring-primary"
                          />
                          <div className="ml-3">
                            <div className="font-medium text-gray-800">Express Delivery</div>
                            <div className="text-sm text-gray-600">30-60 minutes • Rs. 50</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Instructions (Optional)</label>
                      <textarea
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="e.g., Leave at front door, Ring doorbell, etc."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Information */}
              {currentStep === 3 && (
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Information</h2>

                  <div className="space-y-6">
                    {/* Pakistani Payment Methods */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">Select Payment Method</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center p-4 border-2 border-orange-500 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="jazzcash"
                            checked={formData.paymentMethod === 'jazzcash'}
                            onChange={handleInputChange}
                            className="text-orange-500 focus:ring-orange-500"
                          />
                          <div className="ml-3 flex items-center">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-bold">JC</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">JazzCash</div>
                              <div className="text-sm text-gray-600">Mobile Wallet Payment</div>
                            </div>
                          </div>
                        </label>
                        <label className="flex items-center p-4 border-2 border-green-600 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="easypaisa"
                            checked={formData.paymentMethod === 'easypaisa'}
                            onChange={handleInputChange}
                            className="text-green-600 focus:ring-green-600"
                          />
                          <div className="ml-3 flex items-center">
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-bold">EP</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">Easypaisa</div>
                              <div className="text-sm text-gray-600">Digital Payment Service</div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* JazzCash Payment */}
                    {formData.paymentMethod === 'jazzcash' && (
                      <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-white text-lg font-bold">JC</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">JazzCash Payment</h3>
                            <p className="text-sm text-gray-600">Pay securely using your JazzCash mobile wallet</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                            <input
                              type="tel"
                              name="jazzCashNumber"
                              placeholder="03XX-XXXXXXX"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                              required
                            />
                          </div>
                          
                          <div className="bg-white p-4 rounded border border-orange-200">
                            <div className="flex items-start space-x-3">
                              <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <h4 className="text-sm font-medium text-gray-800 mb-1">Payment Instructions:</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  <li>• You will receive an SMS with payment details</li>
                                  <li>• Follow the instructions to complete payment</li>
                                  <li>• Payment will be processed within 2-3 minutes</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Easypaisa Payment */}
                    {formData.paymentMethod === 'easypaisa' && (
                      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-white text-lg font-bold">EP</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">Easypaisa Payment</h3>
                            <p className="text-sm text-gray-600">Pay securely using your Easypaisa account</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                            <input
                              type="tel"
                              name="easypaisaNumber"
                              placeholder="03XX-XXXXXXX"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors"
                              required
                            />
                          </div>
                          
                          <div className="bg-white p-4 rounded border border-green-200">
                            <div className="flex items-start space-x-3">
                              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <h4 className="text-sm font-medium text-gray-800 mb-1">Payment Instructions:</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  <li>• You will be redirected to Easypaisa portal</li>
                                  <li>• Enter your MPIN to authorize payment</li>
                                  <li>• You'll receive confirmation SMS after payment</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Security Notice */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-sm font-medium text-green-800">Secure Online Payment</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">All payments are processed securely with 256-bit SSL encryption</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className={`px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${currentStep === 1 ? 'invisible' : ''
                    }`}
                >
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-8 py-3 ${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg transition-colors font-medium flex items-center justify-center`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>

              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{item.name}</div>
                        <div className="text-gray-600 text-xs">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-800">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-800">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span className="text-gray-800">Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm text-green-800 font-medium">Secure Checkout</span>
                </div>
                <p className="text-xs text-green-700 mt-1">Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;