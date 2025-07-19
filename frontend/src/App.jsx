import { useState } from 'react'
import './App.css'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import SellerLogin from './components/SellerLogin'
import SellerWelcome from './components/SellerWelcome'
import AddProduct from './components/AddProduct'
import ProductList from './components/ProductList'
import Orders from './components/Orders'
import Notifications from './components/Notifications'
import SellerDashbord from './pages/SellerDashobrd'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './components/UserLogin'
import AllProducts from './pages/AllProducts';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import FAQ from './pages/faq'
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DealsOffers from './pages/DealsOffers';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import ResetPassword from './pages/ResetPassword';
import Account from './pages/Account';
import TestEmail from './pages/TestEmail';

function App() {
  const isSellerPath = useLocation().pathname.includes("seller")
  const { showUserLogin, isSeller } = useAppContext();
  return (
    <>
      <div>
        {isSellerPath ? null : <Navbar />}
        {showUserLogin ? <Login /> : null}
        <Toaster />
        <div >
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/deals-offers" element={<DealsOffers />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/seller" element={isSeller ? <SellerDashbord /> : <SellerLogin />}>
              <Route index element={<SellerWelcome />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="product-list" element={<ProductList />} />
              <Route path="orders" element={<Orders />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/resend-verification" element={<ResendVerification />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/account" element={<Account />} />
            <Route path="/test-email" element={<TestEmail />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </div>
        {isSellerPath ? null : <Footer />}
      </div>
    </>
  )
}

export default App
