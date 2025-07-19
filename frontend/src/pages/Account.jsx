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
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    phoneNumber: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'text-gray-400'
  });

  // Redirect if not logged in and fetch addresses
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));

      // Fetch user addresses
      fetchAddresses();
    }
  }, [user, isLoading, navigate]);

  // Fetch user addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/addresses');
      setAddresses(response.data.addresses || []);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

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
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'profile'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-light hover:text-text'
                  }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'addresses'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-light hover:text-text'
                  }`}
              >
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'security'
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
            ) : activeTab === 'addresses' ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-text">My Addresses</h2>
                  {!showAddressForm && (
                    <button
                      onClick={() => {
                        setShowAddressForm(true);
                        setEditingAddressId(null);
                        setAddressFormData({
                          firstName: '',
                          lastName: '',
                          streetAddress: '',
                          phoneNumber: '',
                          city: '',
                          state: '',
                          zipCode: '',
                          isDefault: false
                        });
                      }}
                      className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add New Address
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                    <h3 className="text-lg font-medium text-text mb-4">
                      {editingAddressId ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setError('');

                      try {
                        setLoading(true);

                        // Validate form
                        if (!addressFormData.firstName || !addressFormData.lastName ||
                          !addressFormData.streetAddress || !addressFormData.phoneNumber ||
                          !addressFormData.city || !addressFormData.state || !addressFormData.zipCode) {
                          setError('All fields are required');
                          setLoading(false);
                          return;
                        }

                        let response;
                        if (editingAddressId) {
                          // Update existing address
                          response = await axios.put(`/api/user/address/${editingAddressId}`, addressFormData);
                        } else {
                          // Add new address
                          response = await axios.post('/api/user/address', addressFormData);
                        }

                        // Update addresses list
                        setAddresses(response.data.addresses);

                        // Reset form and close it
                        setShowAddressForm(false);
                        setEditingAddressId(null);

                        toast.success(response.data.message);
                      } catch (err) {
                        setError(err.response?.data?.message || 'Failed to save address');
                        toast.error('Failed to save address');
                      } finally {
                        setLoading(false);
                      }
                    }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-text mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={addressFormData.firstName}
                          onChange={(e) => setAddressFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="border border-gray-300 rounded-md w-full p-2 focus:border-primary focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-text mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={addressFormData.lastName}
                          onChange={(e) => setAddressFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="border border-gray-300 rounded-md w-full p-2 focus:border-primary focus:outline-none"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="streetAddress" className="block text-sm font-medium text-text mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="streetAddress"
                          value={addressFormData.streetAddress}
                          onChange={(e) => setAddressFormData(prev => ({ ...prev, streetAddress: e.target.value }))}
                          className="border border-gray-300 rounded-md w-full p-2 focus:border-primary focus:outline-none"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-text mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          value={addressFormData.phoneNumber}
                          onChange={(e) => setAddressFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          className="border border-gray-300 rounded-md w-full p-2 focus:border-primary focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-text mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          value={addressFormData.city}
                          onChange={(e) => setAddressFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="border border-gray-300 rounded-md w-full p-2 focus:border-primary focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-text mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          value={addressFormData.state}
                          onChange={(e) => setAddressFormData(prev => ({ ...prev, state: e.target.value }))}
                          className="border border-gray-300 rounded-md w-full p-2 focus:border-primary focus:outline-none"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="zipCode" className="block text-sm font-medium text-text mb-1">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          value={addressFormData.zipCode}
                          onChange={(e) => setAddressFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                          className="border border-gray-300 rounded-md w-full p-2 focus:border-primary focus:outline-none"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={addressFormData.isDefault}
                            onChange={(e) => setAddressFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-text">Set as default address</span>
                        </label>
                      </div>

                      {error && (
                        <div className="md:col-span-2 text-red-600 text-sm">
                          {error}
                        </div>
                      )}

                      <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddressId(null);
                          }}
                          className="text-text bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition"
                        >
                          {loading ? 'Saving...' : 'Save Address'}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <>
                    {addresses.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-text-light mb-4">You don't have any saved addresses yet.</p>
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition"
                        >
                          Add Your First Address
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <div
                            key={address._id}
                            className={`p-4 rounded-lg border ${address.isDefault ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                          >
                            {address.isDefault && (
                              <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-2">
                                Default Address
                              </span>
                            )}
                            <p className="font-medium">{address.firstName} {address.lastName}</p>
                            <p className="text-text-light text-sm mt-1">{address.streetAddress}</p>
                            <p className="text-text-light text-sm">{address.city}, {address.state} {address.zipCode}</p>
                            <p className="text-text-light text-sm">{address.phoneNumber}</p>

                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => {
                                  setEditingAddressId(address._id);
                                  setAddressFormData({
                                    firstName: address.firstName,
                                    lastName: address.lastName,
                                    streetAddress: address.streetAddress,
                                    phoneNumber: address.phoneNumber,
                                    city: address.city,
                                    state: address.state,
                                    zipCode: address.zipCode,
                                    isDefault: address.isDefault
                                  });
                                  setShowAddressForm(true);
                                }}
                                className="text-primary hover:text-primary-dark text-sm font-medium"
                              >
                                Edit
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={async () => {
                                  if (window.confirm('Are you sure you want to delete this address?')) {
                                    try {
                                      setLoading(true);
                                      const response = await axios.delete(`/api/user/address/${address._id}`);
                                      setAddresses(response.data.addresses);
                                      toast.success('Address deleted successfully');
                                    } catch (err) {
                                      toast.error('Failed to delete address');
                                    } finally {
                                      setLoading(false);
                                    }
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                Delete
                              </button>
                              {!address.isDefault && (
                                <>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    onClick={async () => {
                                      try {
                                        setLoading(true);
                                        const response = await axios.put(`/api/user/address/${address._id}`, {
                                          ...address,
                                          isDefault: true
                                        });
                                        setAddresses(response.data.addresses);
                                        toast.success('Default address updated');
                                      } catch (err) {
                                        toast.error('Failed to update default address');
                                      } finally {
                                        setLoading(false);
                                      }
                                    }}
                                    className="text-primary hover:text-primary-dark text-sm font-medium"
                                  >
                                    Set as Default
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
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
                          className={`h-full ${passwordStrength.score === 1 ? 'bg-red-500' :
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