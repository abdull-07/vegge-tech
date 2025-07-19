import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

function FAQ() {
  const { navigate } = useAppContext();
  const [openItems, setOpenItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      category: "🛒 Ordering & Shopping",
      items: [
        {
          question: "How do I place an order?",
          answer: "Placing an order is simple! Browse our fresh products, add items to your cart by clicking the 'Add' button, review your cart, select your delivery address, choose your payment method (COD or Online), and click 'Place Order'. You'll receive a confirmation and can track your order in 'My Orders'."
        },
        {
          question: "Is there a minimum order value?",
          answer: "Yes, we have a minimum order value of Rs. 1500 to ensure efficient delivery and maintain product quality. This helps us provide you with the freshest vegetables and fruits while keeping delivery costs reasonable."
        },
        {
          question: "Can I modify or cancel my order?",
          answer: "You can modify or cancel your order within 10 minutes of placing it. After that, our team starts preparing your fresh produce for delivery. Contact our support team immediately if you need to make changes."
        }
      ]
    },
    {
      category: "💳 Payment & Pricing",
      items: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept Cash on Delivery (COD) with a Rs. 30 delivery fee, and Online Payment (free delivery). Online payments include credit/debit cards, digital wallets, and net banking. Choose your preferred method during checkout."
        },
        {
          question: "Are there any additional charges?",
          answer: "We charge a 5% tax on all orders and a Rs. 30 delivery fee for COD orders. Online payments get free delivery! All prices are transparent with no hidden charges."
        },
        {
          question: "Do you offer any discounts or deals?",
          answer: "Yes! Check our 'Deals & Offers' section for special bundles, seasonal discounts, and fresh produce combos. We regularly update our offers to give you the best value for fresh, quality products."
        }
      ]
    },
    {
      category: "🚚 Delivery & Areas",
      items: [
        {
          question: "Which areas do you deliver to?",
          answer: "We currently deliver to Civil Lines, Satellite Town, Gojra Road, Ayub Chowk, Chiniot Road, Jhang Sadar, Shorkot Road, Mohala Hadri, Milad Chowk, and Mohala Purana Bag. Select your area during checkout to confirm delivery availability."
        },
        {
          question: "How long does delivery take?",
          answer: "We deliver fresh produce within 60 minutes of order confirmation! Our quick delivery ensures you receive the freshest vegetables and fruits at your doorstep."
        },
        {
          question: "Can I track my order?",
          answer: "Absolutely! Once your order is confirmed, you can track its status in the 'My Orders' section of your account. You'll see real-time updates from order confirmation to delivery."
        }
      ]
    },
    {
      category: "🥬 Product Quality & Support",
      items: [
        {
          question: "How do you ensure product freshness?",
          answer: "We source directly from local farms and maintain a cold chain throughout our process. Our products are handpicked daily, stored in optimal conditions, and delivered within hours to ensure maximum freshness and nutritional value."
        },
        {
          question: "What if I receive damaged or incorrect items?",
          answer: "We're committed to quality! If you receive damaged or incorrect items, contact our support team immediately with photos. We'll arrange for immediate replacement or full refund within 24 hours."
        },
        {
          question: "How do I contact customer support?",
          answer: "Reach our friendly support team via email at support@veggetech.com, call us at +92-300-VEGGIE, or use the contact form on our website. We're available 7 days a week to help you!"
        }
      ]
    },
    {
      category: "👨‍💼 For Sellers",
      items: [
        {
          question: "How can I become a seller on VeggeTech?",
          answer: "Currently, VeggeTech operates with a curated selection of premium suppliers to ensure consistent quality. We're always looking for quality partners. Contact us at partnerships@veggetech.com to discuss opportunities."
        },
        {
          question: "How do sellers manage their products?",
          answer: "Our admin team manages all product listings, inventory, and quality control to maintain consistent standards. This ensures customers always receive the freshest, highest-quality produce."
        }
      ]
    }
  ];

  // Toggle FAQ item open/closed
  const toggleItem = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filter FAQ items based on search term
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about VeggeTech's fresh produce delivery service
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4">
                <h2 className="text-xl font-semibold text-white">{category.category}</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {category.items.map((item, itemIndex) => {
                  const key = `${categoryIndex}-${itemIndex}`;
                  const isOpen = openItems[key];

                  return (
                    <div key={itemIndex} className="transition-all duration-200">
                      <button
                        onClick={() => toggleItem(categoryIndex, itemIndex)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-800 pr-4">
                            {item.question}
                          </h3>
                          <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </button>

                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {searchTerm && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any FAQ items matching "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Contact Support Section */}
        <div className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our friendly support team is here to help you with anything you need!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              📞 Contact Support
            </button>
            <button
              onClick={() => navigate('/all-products')}
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition"
            >
              🛒 Start Shopping
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/my-orders')}
              className="px-4 py-2 text-primary hover:text-secondary transition"
            >
              My Orders
            </button>
            <button
              onClick={() => navigate('/account')}
              className="px-4 py-2 text-primary hover:text-secondary transition"
            >
              My Account
            </button>
            <button
              onClick={() => navigate('/deals-offers')}
              className="px-4 py-2 text-primary hover:text-secondary transition"
            >
              Deals & Offers
            </button>
            <button
              onClick={() => navigate('/privacy')}
              className="px-4 py-2 text-primary hover:text-secondary transition"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
