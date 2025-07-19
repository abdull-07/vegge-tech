import React, { useState, useEffect } from "react";
import { useAppContext } from '../context/AppContext'
import { NavLink, Outlet } from "react-router-dom";
import NavLogo from "../assets/nav-log0.svg"
import toast from "react-hot-toast";
import axios from "axios";

const SellerDashboard = () => {
  const { isSeller, setisSeller, navigate, axios } = useAppContext()
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch unread notifications count
  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/api/notifications?unreadOnly=true');
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch unread notifications count:', error);
    }
  };

  // Fetch unread count on component mount and periodically
  useEffect(() => {
    if (isSeller) {
      fetchUnreadCount();

      // Set up polling for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);

      return () => clearInterval(interval);
    }
  }, [isSeller]);

  const addProductIcon = (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
    </svg>
  );

  const overviewIcon = (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );

  const ordersIcon = (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  );

  const notificationIcon = (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C19 17.4 19 18 18.462 18H5.538C5 18 5 17.4 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.5 18c.35.654.98 1.5 2 1.5s1.65-.846 2-1.5" />
    </svg>
  );

  const sidebarLinks = [
    { name: "Add New Product", path: "/seller/add-product", icon: addProductIcon },
    { name: "Overview", path: "/seller/product-list", icon: overviewIcon },
    { name: "Orders", path: "/seller/orders", icon: ordersIcon },
    { name: "Notifications", path: "/seller/notifications", icon: notificationIcon },
  ];

  const logout = async () => {
    try {
      await axios.post('/api/seller/logout', {}, { withCredentials: true }); // Backend clears the cookie
      setisSeller(false);
      toast.success("Seller logged out");
      navigate('/seller');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-gray-300 bg-white transition-all">
        <a href="/">
          <img
            className="h-9"
            src={NavLogo}
            alt="Veggetech Logo"
          />
        </a>
        <div className="flex items-center gap-4 text-text-light">
          <p className="text-sm">Hi! Admin</p>
          <button onClick={logout} className="border border-gray-300 rounded-full text-sm px-4 py-1 text-text hover:bg-secondary-hover transition cursor-pointer">
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex min-h-screen">
        <div className="md:w-64 w-16 border-r text-sm border-gray-300 pt-4 flex flex-col bg-background-light transition-all duration-300">
          {sidebarLinks.map((item, index) => (
            <NavLink
              to={item.path}
              key={item.name} end={item.path === "/seller"}
              className={({ isActive }) => `flex items-center py-3 px-4 gap-3 relative
              ${isActive
                  ? "border-r-[6px] bg-primary/10 border-primary text-primary"
                  : "hover:bg-secondary-hover border-white text-text"
                }`}
            >
              <div className="relative">
                {item.icon}
                {/* Notification badge */}
                {item.name === "Notifications" && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <div className="md:flex hidden items-center gap-2">
                <p>{item.name}</p>
                {/* Desktop notification badge */}
                {item.name === "Notifications" && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-medium">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
            </NavLink>
          ))}
        </div>
        <div className="flex-1 bg-white p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;
