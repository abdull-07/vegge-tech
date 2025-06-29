import React from 'react';
import { useAppContext } from '../context/AppContext';
import { orders } from '../assets/orders';

const MyOrders = () => {
  const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";
  const { user } = useAppContext();

  // Optional: Filter orders by user (if storing user._id later in each order)
  // const userOrders = orders.filter(order => order.userId === user?._id);

  return (
    <div className="min-h-screen bg-background-light px-4 md:px-10 py-10">
      <h2 className="text-xl font-semibold text-text mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">You have no orders yet.</p>
      ) : (
        orders.map((order, index) => (
          <div
            key={index}
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
                    {item.product.name}
                    <span className={`text-primary ${item.quantity < 2 && 'hidden'}`}>
                      &nbsp;× {item.quantity}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            {/* Middle - Address */}
            <div className="text-sm text-text-light flex-1 leading-5">
              <p className="font-medium text-text">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>
                {order.address.street}, {order.address.city},{" "}
                {order.address.state}, {order.address.zipcode},{" "}
                {order.address.country}
              </p>
            </div>

            {/* Right - Amount */}
            <div className="text-right min-w-[100px]">
              <p className="text-base font-semibold text-primary">Rs. {order.amount}</p>
              <p className="text-sm mt-1 text-gray-500">{order.paymentType}</p>
              <p className="text-xs text-text-light">On {order.orderDate}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;