import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Orders = () => {
  const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios } = useAppContext();

  // Fetch all orders for seller
  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/order/seller');
      setOrders(response.data.orders || []);
      console.log("Seller orders fetched:", response.data.orders);
    } catch (error) {
      console.error('Failed to fetch seller orders:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Mark order as paid
  const markOrderAsPaid = async (orderId) => {
    try {
      const response = await axios.put(`/api/order/mark-paid/${orderId}`);
      
      if (response.data.message) {
        // Update the local orders state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, isPaid: true, paymentStatus: 'success', paidAt: new Date() }
              : order
          )
        );
        
        toast.success('Order marked as paid successfully!');
      }
    } catch (error) {
      console.error('Failed to mark order as paid:', error);
      toast.error(error.response?.data?.message || 'Failed to update payment status');
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  if (loading) {
    return (
      <div className="md:p-10 p-4 space-y-4 bg-background-light min-h-screen">
        <h2 className="text-xl font-semibold text-text">Orders List</h2>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-10 p-4 space-y-4 bg-background-light min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text">Orders List</h2>
        <button
          onClick={fetchSellerOrders}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition text-sm"
        >
          Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <img
            className="w-24 h-24 mx-auto mb-4 opacity-50"
            src={boxIcon}
            alt="No orders"
          />
          <p className="text-gray-500 text-lg mb-4">No orders found.</p>
          <p className="text-gray-400 text-sm">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        orders.map((order, index) => (
          <div
            key={order._id || index}
            className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 rounded-md border border-text-light/30 bg-white text-text-light shadow-sm w-full"
          >
            {/* Product Info */}
            <div className="flex gap-5">
              <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="boxIcon" />
              <div className="flex flex-col justify-center">
                {order.items.map((item, idx) => (
                  <p key={idx} className="font-medium text-text">
                    {item.product?.name || 'Product Name'}
                    <span className={`text-primary ${item.quantity < 2 ? 'hidden' : ''}`}> × {item.quantity}</span>
                  </p>
                ))}
                <p className="text-xs text-gray-500 mt-1">
                  Status: <span className="font-medium">{order.status}</span>
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="text-sm leading-5">
              <p className="font-medium text-text mb-1">{order.address?.firstName} {order.address?.lastName}</p>
              <p>
                {order.address?.streetAddress}, {order.address?.city}, {order.address?.state}, {order.address?.zipCode}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Phone: {order.address?.phoneNumber}
              </p>
            </div>

            {/* Amount */}
            <p className="font-medium text-base text-primary text-right md:text-left">Rs. {order.amount}</p>

            {/* Payment Info & Actions */}
            <div className="flex flex-col text-sm text-text-light leading-5">
              <p>
                <span className="font-medium text-text">Method:</span> {order.paymentType}
              </p>
              <p>
                <span className="font-medium text-text">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-medium text-text">Payment:</span>
                {order.isPaid ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <span>✅</span>
                    <span>Paid</span>
                  </span>
                ) : (
                  <span className="text-red-600">Pending</span>
                )}
              </div>
              
              {/* Mark as Paid Button - Only show for COD orders that aren't paid */}
              {order.paymentType === "Cash On Delivery" && !order.isPaid && (
                <button
                  onClick={() => markOrderAsPaid(order._id)}
                  className="mt-3 px-3 py-1.5 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors duration-200 font-medium"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
