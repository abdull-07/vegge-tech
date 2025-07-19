import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const SellerWelcome = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    unreadNotifications: 0,
    todayOrders: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch orders
      const ordersResponse = await axios.get('/api/order/seller');
      const orders = ordersResponse.data.orders || [];

      // Fetch products
      const productsResponse = await axios.get('/api/product/all-products');
      const products = productsResponse.data.products || [];

      // Fetch notifications
      const notificationsResponse = await axios.get('/api/notifications?unreadOnly=true');
      const unreadCount = notificationsResponse.data.unreadCount || 0;

      // Calculate today's orders
      const today = new Date().toDateString();
      const todayOrders = orders.filter(order =>
        new Date(order.createdAt).toDateString() === today
      ).length;

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        unreadNotifications: unreadCount,
        todayOrders: todayOrders
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Quick action cards data
  const quickActions = [
    {
      title: "Add New Product",
      description: "Add fresh products to your inventory",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      action: () => navigate('/seller/add-product')
    },
    {
      title: "Manage Products",
      description: "View and edit your product catalog",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      action: () => navigate('/seller/product-list')
    },
    {
      title: "View Orders",
      description: "Check and manage customer orders",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      action: () => navigate('/seller/orders')
    },
    {
      title: "Notifications",
      description: "Check new order notifications",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C19 17.4 19 18 18.462 18H5.538C5 18 5 17.4 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.5 18c.35.654.98 1.5 2 1.5s1.65-.846 2-1.5" />
        </svg>
      ),
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      action: () => navigate('/seller/notifications'),
      badge: stats.unreadNotifications > 0 ? stats.unreadNotifications : null
    }
  ];

  // Stats cards data
  const statsCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "📋",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: "🎯",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Notifications",
      value: stats.unreadNotifications,
      icon: "🔔",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-lg opacity-90">
              Ready to manage your VeggeTech store? Here's your dashboard overview.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-6xl opacity-20">🏪</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-6 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-2`}>
                  {stat.value}
                </p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={action.action}
              className={`${action.color} ${action.hoverColor} text-white rounded-lg p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg relative`}
            >
              {action.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {action.badge > 99 ? '99+' : action.badge}
                </span>
              )}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 opacity-90">
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">📈 Grow Your Business</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Add high-quality product images
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Write detailed product descriptions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Set competitive pricing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Monitor order notifications regularly
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">🎯 Quick Tips</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Check orders daily for timely processing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Keep product inventory updated
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Respond to notifications promptly
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Review product performance regularly
              </li>
            </ul>
          </div>
        </div>
      </div> */}

      {/* Support Section */}
      {/* <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help? 🤝</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions or need assistance, we're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition">
              📧 Contact Support
            </button>
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition">
              📖 View Documentation
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SellerWelcome;
