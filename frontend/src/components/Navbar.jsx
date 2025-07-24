import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import userImg from "../assets/user-2.png";
import navLogo from "../assets/nav-log0.svg";

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const { user, setShowUserLogin, navigate, seacrhQuery, setSeacrhQuery, getTotalCartItems, logoutUser } = useAppContext()

    const handleLogout = async () => {
        await logoutUser();
        setOpen(false);
    }

    useEffect(() => {
        if (seacrhQuery.length > 0) {
            navigate("/all-products")
        } else {

        }
    }, [seacrhQuery])


    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to="/">
                <img src={navLogo} alt="VeggeTech" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/all-products">All Products</NavLink>
                <NavLink to="/contact">Contact Us</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e) => setSeacrhQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                        <path clip-rule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>

                <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#615fff" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">{getTotalCartItems()}</button>
                </div>

                {!user ?
                    (<button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                        Login
                    </button>) : (<div className='relative group'>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <img className='w-[40px] h-[40px] rounded-full object-cover border-2 border-indigo-500'
                                src={userImg}
                                alt={user.name} />
                            <span className="hidden md:block text-sm font-medium">{user.name?.split(' ')[0]}</span>
                        </div>
                        <ul className='hidden group-hover:block absolute top-12 right-0 bg-white shadow-lg border border-gray-200 py-2 w-[220px] rounded-md text-sm z-40'>
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                            <li onClick={() => navigate("/my-orders")} className='p-2 px-4 hover:bg-gray-50 cursor-pointer flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                                My Orders
                            </li>
                            <li onClick={() => navigate("/account")} className='p-2 px-4 hover:bg-gray-50 cursor-pointer flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                My Account
                            </li>
                            <li onClick={handleLogout} className='p-2 px-4 hover:bg-gray-50 text-red-500 cursor-pointer flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Logout
                            </li>
                        </ul>
                    </div>)}
            </div>

            <div className='sm:hidden flex items-center gap-10'>
                <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#615fff" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">{getTotalCartItems()}</button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                    {/* Menu Icon SVG */}
                    <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="21" height="1.5" rx=".75" fill="#426287" />
                        <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                        <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                    </svg>
                </button>
            </div>


            {/* Mobile Menu - Enhanced Version */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                 onClick={() => setOpen(false)}>
            </div>
            
            <div className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                        <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    {/* User Profile Section */}
                    {user ? (
                        <div className="p-4 border-b">
                            <div className="flex items-center space-x-3">
                                <img className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500" 
                                     src={userImg} 
                                     alt={user.name} />
                                <div>
                                    <p className="font-medium text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    {!user.isVerified && (
                                        <span className="inline-block mt-1 text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                                            Email not verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 border-b">
                            <button 
                                onClick={() => { setOpen(false); setShowUserLogin(true) }} 
                                className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-lg text-sm font-medium"
                            >
                                Login / Register
                            </button>
                        </div>
                    )}
                    
                    {/* Search Bar */}
                    <div className="p-4 border-b">
                        <div className="flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-lg">
                            <input 
                                onChange={(e) => setSeacrhQuery(e.target.value)} 
                                className="py-2 w-full bg-transparent outline-none placeholder-gray-500" 
                                type="text" 
                                placeholder="Search products" 
                            />
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    
                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="py-2">
                            <NavLink to="/" 
                                className={({isActive}) => `flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 ${isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-500' : ''}`}
                                onClick={() => setOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                Home
                            </NavLink>
                            
                            <NavLink to="/all-products" 
                                className={({isActive}) => `flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 ${isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-500' : ''}`}
                                onClick={() => setOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                                    <rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                    <line x1="8" y1="16" x2="16" y2="16"></line>
                                    <line x1="8" y1="8" x2="16" y2="8"></line>
                                </svg>
                                All Products
                            </NavLink>
                            
                            <NavLink to="/cart" 
                                className={({isActive}) => `flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 ${isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-500' : ''}`}
                                onClick={() => setOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                Cart
                                <span className="ml-auto bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {getTotalCartItems()}
                                </span>
                            </NavLink>
                            
                            {user && (
                                <NavLink to="/my-orders" 
                                    className={({isActive}) => `flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 ${isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-500' : ''}`}
                                    onClick={() => setOpen(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                                    </svg>
                                    My Orders
                                </NavLink>
                            )}
                            
                            {user && (
                                <NavLink to="/account" 
                                    className={({isActive}) => `flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 ${isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-500' : ''}`}
                                    onClick={() => setOpen(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    My Account
                                </NavLink>
                            )}
                            
                            <NavLink to="/contact" 
                                className={({isActive}) => `flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 ${isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-500' : ''}`}
                                onClick={() => setOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                </svg>
                                Contact Us
                            </NavLink>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="p-4 border-t">
                        {user ? (
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Logout
                            </button>
                        ) : (
                            <div className="text-center text-sm text-gray-500">
                                Login to access all features
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </nav>
    )
}

export default Navbar
