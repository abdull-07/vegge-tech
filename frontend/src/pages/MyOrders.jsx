import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";
  const { user, axios, navigate } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user orders from backend
  const fetchUserOrders = async () => {
    try {
      if (!user) {
        navigate('/');
        return;
      }

      setLoading(true);
      const response = await axios.get('/api/order/user');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light px-4 md:px-10 py-10">
        <h2 className="text-xl font-semibold text-text mb-6">My Orders</h2>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light px-4 md:px-10 py-10">
      <h2 className="text-xl font-semibold text-text mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <img
            className="w-24 h-24 mx-auto mb-4 opacity-50"
            src={boxIcon}
            alt="No orders"
          />
          <p className="text-gray-500 text-lg mb-4">You have no orders yet.</p>
          <button
            onClick={() => navigate('/all-products')}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        orders.map((order, index) => (
          <div
            key={order._id || index}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 mb-4 rounded-md border border-text-light/30 bg-white text-text-light shadow-sm"
          >
            {/* Left - Product Info */}
            <div className="flex gap-5 flex-1">
              <img
                className="w-12 h-12 object-cover opacity-60"
                src={boxIcon}
                alt="boxIcon"
              />
              <div className="flex flex-col justify-center text-sm text-text">
                {order.items.map((item, idx) => (
                  <p key={idx} className="font-medium">
                    {item.product?.name || 'Product Name'}
                    <span className={`text-primary ${item.quantity < 2 && 'hidden'}`}>
                      &nbsp;× {item.quantity}
                    </span>
                  </p>
                ))}
                <p className="text-xs text-gray-500 mt-1">
                  Status: <span className="font-medium">{order.status}</span>
                </p>
              </div>
            </div>

            {/* Middle - Address */}
            <div className="text-sm text-text-light flex-1 leading-5">
              <p className="font-medium text-text">
                {order.address?.firstName} {order.address?.lastName}
              </p>
              <p>
                {order.address?.streetAddress}, {order.address?.city},{" "}
                {order.address?.state}, {order.address?.zipCode}
              </p>
            </div>

            {/* Right - Amount & Date */}
            <div className="text-right min-w-[100px]">
              <p className="text-base font-semibold text-primary">Rs. {order.amount}</p>
              <p className="text-sm mt-1 text-gray-500">{order.paymentType}</p>
              <p className="text-xs text-text-light">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;