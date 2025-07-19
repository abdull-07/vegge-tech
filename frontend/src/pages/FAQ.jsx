import React from 'react'

function FAQ() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
      <div className="space-y-4">
        <div className="border rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Q: How do I place an order?</h2>
          <p className="text-gray-700">A: You can place an order by browsing our products, adding them to your cart, and proceeding to checkout. Follow the on-screen instructions to complete your purchase.</p>
        </div>
        <div className="border rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Q: What payment methods do you accept?</h2>
          <p className="text-gray-700">A: We accept Cash on Delivery and various online payment methods. You can select your preferred option during checkout.</p>
        </div>
        <div className="border rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Q: Can I track my order?</h2>
          <p className="text-gray-700">A: Yes, once your order is confirmed, you will receive a tracking number and a link to monitor its status.</p>
        </div>
        <div className="border rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Q: How can sellers manage their products?</h2>
          <p className="text-gray-700">A: Sellers can log in to their dashboard to add, update, and manage their product listings, including stock availability.</p>
        </div>
        <div className="border rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Q: What if I receive damaged or incorrect items?</h2>
          <p className="text-gray-700">A: Please contact our customer support immediately with details and photos of the issue. We will arrange for a replacement or refund as soon as possible.</p>
        </div>
        <div className="border rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Q: Is there a minimum order value?</h2>
          <p className="text-gray-700">A: There is no minimum order value. You can order as little or as much as you need.</p>
        </div>
        <div className="border rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Q: How do I contact customer support?</h2>
          <p className="text-gray-700">A: You can reach our customer support team via email at support@veggetech.com or by calling us at +1-800-VEGGETECH.</p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
