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

  const dashboardIcon = (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z" />
    </svg>
  );

  const overviewIcon = (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M7.111 20A3.111 3.111 0 0 1 4 16.889v-12C4 4.398 4.398 4 4.889 4h4.444a.89.89 0 0 1 .89.889v12A3.111 3.111 0 0 1 7.11 20Zm0 0h12a.889.889 0 0 0 .889-.889v-4.444a.889.889 0 0 0-.889-.89h-4.389a.889.889 0 0 0-.62.253l-3.767 3.665a.933.933 0 0 0-.146.185c-.868 1.433-1.581 1.858-3.078 2.12Zm0-3.556h.009m7.933-10.927 3.143 3.143a.889.889 0 0 1 0 1.257l-7.974 7.974v-8.8l3.574-3.574a.889.889 0 0 1 1.257 0Z" />
    </svg>
  );

  const chatIcon = (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    </svg>
  );

  const notificationIcon = (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C19 17.4 19 18 18.462 18H5.538C5 18 5 17.4 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.5 18c.35.654.98 1.5 2 1.5s1.65-.846 2-1.5" />
    </svg>
  );

  const sidebarLinks = [
    { name: "Add New Product", path: "/seller/add-product", icon: dashboardIcon },
    { name: "Overview", path: "/seller/product-list", icon: overviewIcon },
    { name: "Orders", path: "/seller/orders", icon: chatIcon },
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
