import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

function FAQ() {
  const faqItems = [
    {
      question: "How do I place an order?",
      answer:
        "You can place an order by browsing our products, adding them to your cart, and proceeding to checkout. Follow the on-screen instructions to complete your purchase.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept Cash on Delivery and various online payment methods. You can select your preferred option during checkout.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes, once your order is confirmed, you will receive a tracking number and a link to monitor its status.",
    },
    {
      question: "How can sellers manage their products?",
      answer:
        "Sellers can log in to their dashboard to add, update, and manage their product listings, including stock availability.",
    },
    {
      question: "What if I receive damaged or incorrect items?",
      answer:
        "Please contact our customer support immediately with details and photos of the issue. We will arrange for a replacement or refund as soon as possible.",
    },
    {
      question: "Is there a minimum order value?",
      answer: "There is no minimum order value. You can order as little or as much as you need.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach our customer support team via email at support@veggetech.com or by calling us at +1-800-VEGGETECH.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-center text-primary mb-10 flex items-center justify-center gap-2">
        <FaQuestionCircle className="text-primary text-3xl" />
        Frequently Asked Questions
      </h1>

      <div className="space-y-6">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300 bg-[#78c0435e]"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{`Q${index + 1}: ${item.question}`}</h2>
            <p className="text-gray-600 leading-relaxed">{`A: ${item.answer}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
