import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
const Cart = () => {
  const { navigate, products, cartItems, updateCart, removeProductFromCart, getTotalCartItems, getTotalCartPrice, user, axios } = useAppContext();

  const [cartProducts, setCartProducts] = useState([])
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    phone: "",
    city: "",
    state: "",
    zipcode: ""
  });

  const [paymentOption, setPaymentOption] = useState("COD");
  const [selectedArea, setSelectedArea] = useState("");
  const [areaValidationMessage, setAreaValidationMessage] = useState("");

  // Allowed delivery areas
  const deliveryAreas = [
    "Civil Lines",
    "Satellite Town",
    "Gojra Road",
    "Shorkot Cantt",
    "Ayub Chowk",
    "Chiniot Road",
    "Waryam Wala",
    "Kot Lakhnana",
    "Garh Maharaja",
    "Bhawana Road",
    "Shah Jewana",
    "Jhang Sadar",
    "Chak No. 18",
    "Shorkot Road",
    "Mohala Hadri"

  ];

  // Fetch user addresses
  const fetchUserAddresses = async () => {
    if (!user) return;

    try {
      const response = await axios.get('/api/user/addresses');
      const userAddresses = response.data.addresses || [];
      setAddresses(userAddresses);

      // Set the default address as selected
      const defaultAddress = userAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (userAddresses.length > 0) {
        setSelectedAddress(userAddresses[0]);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      // If user doesn't have addresses or API fails, use empty array
      setAddresses([]);
    }
  };

  // Function to show the cart items on cart Page
  const getCartItem = () => {
    let tempArray = [];

    // Combine all product categories into a single array
    const allProducts = [
      ...(products.fruits || []),
      ...(products.vegetables || []),
      ...(products.bundles || [])
    ];

    for (const key in cartItems) {
      const product = allProducts.find((item) => String(item._id) === String(key));
      if (product) {
        tempArray.push({ ...product, quantity: cartItems[key] });
      }
    }

    setCartProducts(tempArray);
  };


  useEffect(() => {
    if (
      (products.fruits?.length > 0 || products.vegetables?.length > 0 || products.bundles?.length > 0) &&
      Object.keys(cartItems).length > 0
    ) {
      getCartItem();
    }
  }, [products, cartItems]);

  // Fetch user addresses when component mounts or user changes
  useEffect(() => {
    fetchUserAddresses();
  }, [user]);

  // handle the product quantituy
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeProductFromCart(id);
    } else {
      updateCart(id, newQuantity);
    }
  };

  // Updated Price Calculation:
  const subtotal = getTotalCartPrice();
  const deliveryFee = paymentOption === "Online" ? 0 : 30;
  const tax = +(subtotal * 0.05).toFixed(0); // 5% tax
  const totalAmount = subtotal + deliveryFee + tax;

  // Minimum order amount
  const minimumOrderAmount = 1500;
  const isOrderAmountValid = subtotal >= minimumOrderAmount;

  // Convert address object to array of formatted strings
  const formatAddress = (addr) =>
    `${addr.firstName || ''} ${addr.lastName || ''}, ${addr.streetAddress || addr.street || ''}, ${addr.phoneNumber || addr.phone || ''}, ${addr.city}, ${addr.state}, ${addr.zipCode || addr.zipcode || ''}`;

  // Area validation function
  const validateAddressArea = (address, selectedArea) => {
    if (!selectedArea || !address) return false;

    const addressText = formatAddress(address).toLowerCase();
    const areaName = selectedArea.toLowerCase();

    // Check if the selected area is mentioned in the address
    return addressText.includes(areaName);
  };

  // Check if the selected address matches the selected area
  const isAreaValid = selectedArea && selectedAddress ? validateAddressArea(selectedAddress, selectedArea) : false;
  const canPlaceOrder = isOrderAmountValid && selectedArea && isAreaValid;

  // Update area validation message when area or address changes
  useEffect(() => {
    if (selectedArea && selectedAddress) {
      if (isAreaValid) {
        setAreaValidationMessage("");
      } else {
        setAreaValidationMessage("We currently do not deliver to this area. Please select the correct area or update your address.");
      }
    } else if (selectedArea && !selectedAddress) {
      setAreaValidationMessage("Please select a delivery address.");
    } else if (!selectedArea && selectedAddress) {
      setAreaValidationMessage("Please select your delivery area.");
    } else {
      setAreaValidationMessage("");
    }
  }, [selectedArea, selectedAddress, isAreaValid]);

  // Payment Handler function
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    if (paymentOption === "COD") {
      // COD: Save order and show success
      console.log("Order placed via COD:", {
        cart: cartProducts,
        address: selectedAddress,
        payment: "Cash on Delivery",
      });

      toast.success("Order placed successfully! We’ll deliver your items in 60 mints.");
      navigate("/"); // Or navigate to an "Order Placed" page
    } else if (paymentOption === "Online") {
      // Placeholder: In future, redirect to Stripe, Razorpay, or similar
      console.log("Redirecting to checkout...");
      // You can later replace this with Stripe/Razorpay integration
      navigate("/checkout");
    }
  };

  return (
    ((products.fruits?.length > 0 || products.vegetables?.length > 0 || products.bundles?.length > 0)
      && Object.keys(cartItems).length > 0) ? (
      <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
        {/* LEFT SIDE – Cart Items */}
        <div className="flex-1 max-w-4xl">
          <h1 className="text-3xl font-medium mb-6 text-text">
            Shopping Cart <span className="text-sm text-primary">({getTotalCartItems()} Items)</span>
          </h1>

          <div className="grid grid-cols-[2fr_1fr_1fr] text-text-light text-base font-medium pb-3">
            <p className="text-left">Product Details</p>
            <p className="text-center">Subtotal</p>
            <p className="text-center">Action</p>
          </div>

          {cartProducts.map((product, index) => (
            <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-text items-center text-sm md:text-base font-medium pt-3">
              <div className="flex items-center md:gap-6 gap-3">
                {/* Product Imge */}
                <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                  <img className="max-w-full h-full object-cover" src={product.imageUrl} alt={product.name} />
                </div>
                {/* product Name and Quantity */}
                <div>
                  <p className="hidden md:block font-semibold">{product.name}</p>
                  <div className="font-normal text-text-light/70">
                    {/* <p>Size: <span>{product.size || "N/A"}</span></p> */}
                    <div className="flex items-center gap-2">
                      <p>Qty:</p>
                      <div className="flex items-center justify-center gap-2 w-[70px] h-[34px] bg-primary/10 rounded">
                        <button
                          className="px-2 text-lg"
                          onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                        >
                          -
                        </button>
                        <span>{product.quantity}</span>
                        <button
                          className="px-2 text-lg"
                          onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
              {/* Price  */}
              <p className="text-center">Rs. {product.offerPrice * product.quantity}</p>
              {/* Action Buttons  to remove from cart*/}
              <button onClick={() => removeProductFromCart(product._id)} className="cursor-pointer mx-auto">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                    stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ))}

          <button
            onClick={() => navigate("/all-products")}
            className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium hover:text-primary-dark transition"
          >
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Continue Shopping
          </button>
        </div>

        {/* RIGHT SIDE – Order Summary */}
        <div className="max-w-[360px] w-full h-full bg-background-light p-5 max-md:mt-16 border border-gray-300">
          <h2 className="text-xl md:text-xl font-medium text-text">Order Summary</h2>
          <hr className="border-gray-300 my-5" />

          {/* Select Area */}
          <div className="mb-4">
            <p className="text-sm font-medium uppercase text-text">Select Area</p>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none rounded"
            >
              <option value="">Choose your delivery area</option>
              {deliveryAreas.map((area, index) => (
                <option key={index} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="mb-6">
            <p className="text-sm font-medium uppercase text-text">Delivery Address</p>
            <div className="relative flex justify-between items-start mt-2">
              <p className="text-text-light">{selectedAddress ? formatAddress(selectedAddress) : "No address found"}</p>
              <button
                onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                className="text-primary hover:underline cursor-pointer"
              >
                Change
              </button>
              {/* Shoew all address */}
              {showAddressDropdown && (
                <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full rounded z-10">
                  {addresses.map((addr, idx) => (
                    <p
                      key={idx}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddressDropdown(false);
                      }}
                      className="text-text p-2 hover:bg-primary/10 cursor-pointer"
                    >
                      {formatAddress(addr)}
                    </p>
                  ))}
                  <p onClick={() => { setShowNewAddressForm(true); }} className="text-primary p-2 text-center hover:bg-primary/10 cursor-pointer"> + Add new address </p>
                </div>
              )}


              {/* Payment Mathod */}
            </div>

            <p className="text-sm font-medium uppercase mt-6 text-text">Payment Method</p>

            <select value={paymentOption} onChange={(e) => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
              <option value="COD">Cash On Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>

          <hr className="border-gray-300" />

          <div className="text-text-light mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Subtotal</span><span>Rs. {subtotal}</span>
            </p>

            <p className="flex justify-between">
              <span>Delivery Fee</span>
              <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                {deliveryFee === 0 ? "Free" : `Rs. ${deliveryFee}`}
              </span>
            </p>

            <p className="flex justify-between">
              <span>Tax (5%)</span><span>Rs. {tax}</span>
            </p>

            <p className="flex justify-between text-lg font-medium text-text mt-3">
              <span>Total Amount:</span><span>Rs. {totalAmount}</span>
            </p>
          </div>

          {/* Minimum Order Warning */}
          {!isOrderAmountValid && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Minimum Order Required:</span> Rs. {minimumOrderAmount}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Add Rs. {minimumOrderAmount - subtotal} more to place your order
              </p>
            </div>
          )}

          {/* Area Validation Message */}
          {areaValidationMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <span className="font-medium">Delivery Area Issue:</span>
              </p>
              <p className="text-xs text-red-600 mt-1">
                {areaValidationMessage}
              </p>
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={!canPlaceOrder}
            className={`w-full py-3 mt-6 font-medium transition ${canPlaceOrder
              ? "cursor-pointer bg-primary text-white hover:bg-secondary-hover"
              : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
          >
            {!isOrderAmountValid
              ? `Minimum Order Rs. ${minimumOrderAmount}`
              : !selectedArea
                ? "Select Delivery Area"
                : !isAreaValid && selectedArea && selectedAddress
                  ? "Area Not Supported"
                  : paymentOption === "Online" ? "Proceed to Checkout" : "Place Order"
            }
          </button>
        </div>

        {/* Add Address Form */}
        {showNewAddressForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white w-full max-w-md mx-4 sm:mx-auto p-6 rounded-lg shadow-lg relative">
              <h2 className="text-xl font-semibold mb-4 text-text">Add New Address</h2>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const isValid = Object.values(newAddress).every(val => val.trim() !== "");
                  if (!isValid) {
                    toast.error("Please fill all fields");
                    return;
                  }

                  if (!user) {
                    toast.error("Please login to add an address");
                    return;
                  }

                  try {
                    // Map the form data to match the backend API
                    const addressData = {
                      firstName: newAddress.firstName,
                      lastName: newAddress.lastName,
                      streetAddress: newAddress.street,
                      phoneNumber: newAddress.phone,
                      city: newAddress.city,
                      state: newAddress.state,
                      zipCode: newAddress.zipcode,
                      isDefault: addresses.length === 0 // Set as default if it's the first address
                    };

                    const response = await axios.post('/api/user/address', addressData);

                    // Update the addresses list with the response
                    setAddresses(response.data.addresses);

                    // Set the newly added address as selected
                    const newAddressFromResponse = response.data.address;
                    setSelectedAddress(newAddressFromResponse);

                    // Reset form and close modal
                    setNewAddress({ firstName: "", lastName: "", street: "", phone: "", city: "", state: "", zipcode: "" });
                    setShowNewAddressForm(false);
                    toast.success("Address added successfully!");
                  } catch (error) {
                    console.error('Failed to add address:', error);
                    toast.error(error.response?.data?.message || "Failed to add address");
                  }
                }}
                className="space-y-4"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newAddress.firstName}
                    onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                    className="w-1/2 border border-gray-300 px-3 py-2 rounded outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newAddress.lastName}
                    onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                    className="w-1/2 border border-gray-300 px-3 py-2 rounded outline-none"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded outline-none"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-1/2 border border-gray-300 px-3 py-2 rounded outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-1/2 border border-gray-300 px-3 py-2 rounded outline-none"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={newAddress.zipcode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipcode: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded outline-none"
                  required
                />

                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-white rounded hover:bg-secondary transition"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(false)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    ) :
      // If Product Cart is Enmpty the show this
      (
        <div className="flex flex-col items-center mt-12 mb-12">
          <p className="text-center text-lg text-gray-500 font-medium mb-4">
            🛒 Your cart is empty. Add items to get started!
          </p>
          <button
            onClick={() => navigate("/all-products")}
            className="px-5 py-2 bg-primary text-white rounded hover:bg-secondary transition"
          >
            Browse Products
          </button>
        </div>

      ));
};

export default Cart;
