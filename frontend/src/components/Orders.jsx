import React, { useState, useEffect } from 'react';
import { orders } from '../assets/orders';

const Orders = () => {
  const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";
  const [order, setOrder] = useState([]);

  useEffect(() => {
    setOrder(orders);
  }, []);

  return (
    <div className="md:p-10 p-4 space-y-4 bg-background-light min-h-screen">
      <h2 className="text-xl font-semibold text-text">Orders List</h2>

      {order.map((order, index) => (
        <div
          key={index}
          className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 rounded-md border border-text-light/30 bg-white text-text-light shadow-sm w-full"
        >
          {/* Product Info */}
          <div className="flex gap-5">
            <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="boxIcon" />
            <div className="flex flex-col justify-center">
              {order.items.map((item, idx) => (
                <p key={idx} className="font-medium text-text">
                  {item.product.name}
                  <span className={`text-primary ${item.quantity < 2 ? 'hidden' : ''}`}> × {item.quantity}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="text-sm leading-5">
            <p className="font-medium text-text mb-1">{order.address.firstName} {order.address.lastName}</p>
            <p>
              {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}, {order.address.country}
            </p>
          </div>

          {/* Amount */}
          <p className="font-medium text-base text-primary text-right md:text-left">Rs. {order.amount}</p>

          {/* Payment Info */}
          <div className="flex flex-col text-sm text-text-light leading-5">
            <p>
              <span className="font-medium text-text">Method:</span> {order.paymentType}
            </p>
            <p>
              <span className="font-medium text-text">Date:</span> {order.orderDate}
            </p>
            <p>
              <span className="font-medium text-text">Payment:</span>{" "}
              <span className={order.isPaid ? "text-green-600" : "text-red-600"}>
                {order.isPaid ? "Paid" : "Pending"}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
