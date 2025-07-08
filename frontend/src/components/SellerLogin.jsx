import React, { useState, useEffect } from 'react'
import { useAppContext} from '../context/AppContext'
import toast from 'react-hot-toast';

const SellerLogin = () => {
  const { isSeller, setisSeller, navigate, axios } = useAppContext()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (isSeller) {
      navigate("/seller")
    }
  }, [isSeller])

  const handleSellerLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        '/api/seller/login',
        { email, password },
        { withCredentials: true } // ✅ ensures cookie is saved
      );

      // ✅ Check based on actual response (you don't return `success` in your backend)
      setisSeller(true);
      toast.success(data.message || "Login successful");
      navigate('/seller');

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      console.error("Login error:", err);
    }
    console.log({ email, password });
  };

  return !isSeller && (
    <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
      <form
        onSubmit={handleSellerLogin}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">Seller</span> Login
        </p>

        <div className="w-full">
          <p className="text-text text-sm mb-1">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
            className="border border-gray-300 rounded w-full p-2 mt-1 outline-primary text-sm"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p className="text-text text-sm mb-1">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
            className="border border-gray-300 rounded w-full p-2 mt-1 outline-primary text-sm"
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-secondary transition-all text-white w-full py-2 rounded-md text-sm font-medium"
        >
          Login
        </button>
      </form>
    </div>

  )
}

export default SellerLogin
