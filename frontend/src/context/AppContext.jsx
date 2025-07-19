import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Backend Intigration
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
// axios.defaults.baseURL = "http://localhost:3000";
// console.log("Axios Base URL:", axios.defaults.baseURL);

// Create Context
export const AppContext = createContext();

// AppContextProvider Component
export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setisSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState({ fruits: [], vegetables: [], bundles: [] });
    const [cartItems, setCartItems] = useState({});
    const [seacrhQuery, setSeacrhQuery] = useState("");
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    // Fetch Seller
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get('/api/seller/check-auth');
            if (data?.user?.email) {
                setisSeller(true);
            } else {
                setisSeller(false);
            }
        } catch (err) {
            setisSeller(false);
            console.error("Seller auth check failed:", err.response?.data?.message || err.message);
        }
    };


    // Fetch Products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/all-products');
            // Group products by category
            const grouped = {
                fruits: data.products.filter(p => p.category === "Fruits" || p.category === "fruits"),
                vegetables: data.products.filter(p => p.category === "Vegetables" || p.category === "vegetables"),
                bundles: data.products.filter(p => p.category === "Bundles" || p.category.toLowerCase() === "bundles"),
            };
            if (!data || !data.products || data.products.length === 0) {
                toast.error("No products available")
            }
            setProducts(grouped);
        } catch (error) {
            toast.error(`Failed to load products: ${error.response?.data?.message || error.message}`);
            console.error("Product fetch error:", error);
            // Set empty categories to prevent undefined errors
            setProducts({ fruits: [], vegetables: [], bundles: [] });
        }
    }

    // Add to Cart
    const addToCart = async (itemId) => {
        try {
            // Find the product details for the cart item
            const allProducts = [
                ...(products.fruits || []),
                ...(products.vegetables || []),
                ...(products.bundles || [])
            ];
            
            const product = allProducts.find(p => p._id === itemId);
            
            if (!product) {
                toast.error("Product not found");
                return;
            }

            if (user) {
                // If user is logged in, save to database
                const response = await axios.post('/api/user/cart/add', {
                    productId: itemId,
                    quantity: 1,
                    name: product.name,
                    price: product.offerPrice,
                    imageUrl: product.imageUrl
                });

                // Update local cart state from database response
                const cartItemsObj = {};
                response.data.cartItem.forEach(item => {
                    cartItemsObj[item.productId] = item.quantity;
                });
                setCartItems(cartItemsObj);
            } else {
                // If user is not logged in, save to local state only
                setCartItems(prev => ({
                    ...prev,
                    [itemId]: (prev[itemId] || 0) + 1
                }));
            }
            
            toast.success("Item added to cart");
        } catch (error) {
            console.error("Add to cart error:", error);
            toast.error(error.response?.data?.message || "Failed to add item to cart");
        }
    }

    // Update Cart
    const updateCart = async (itemId, quantity) => {
        try {
            if (quantity <= 0) {
                removeProductFromCart(itemId);
                return;
            }

            if (user) {
                // If user is logged in, update in database
                const response = await axios.put('/api/user/cart/update', {
                    productId: itemId,
                    quantity: quantity
                });

                // Update local cart state from database response
                const cartItemsObj = {};
                response.data.cartItem.forEach(item => {
                    cartItemsObj[item.productId] = item.quantity;
                });
                setCartItems(cartItemsObj);
            } else {
                // If user is not logged in, update local state only
                setCartItems(prev => ({
                    ...prev,
                    [itemId]: quantity
                }));
            }
            
            toast.success("Cart updated");
        } catch (error) {
            console.error("Update cart error:", error);
            toast.error(error.response?.data?.message || "Failed to update cart");
        }
    }

    //  Remove Product from Cart
    const removeProductFromCart = async (itemId) => {
        try {
            if (user) {
                // If user is logged in, remove from database
                const response = await axios.delete('/api/user/cart/remove', {
                    data: { productId: itemId }
                });

                // Update local cart state from database response
                const cartItemsObj = {};
                response.data.cartItem.forEach(item => {
                    cartItemsObj[item.productId] = item.quantity;
                });
                setCartItems(cartItemsObj);
            } else {
                // If user is not logged in, remove from local state only
                setCartItems(prev => {
                    const newCart = { ...prev };
                    delete newCart[itemId];
                    return newCart;
                });
            }
            
            toast.success("Item removed from cart");
        } catch (error) {
            console.error("Remove from cart error:", error);
            toast.error(error.response?.data?.message || "Failed to remove item from cart");
        }
    }

    useEffect(() => {
        const initializeApp = async () => {
            try {
                // Check user authentication first
                await checkUserAuth();
            } catch (error) {
                console.log("User auth check failed, continuing as guest");
                setUser(null);
                setAuthChecked(true);
                setIsLoading(false);
            }
            
            try {
                // Then check seller authentication
                await fetchSeller();
            } catch (error) {
                console.log("Seller auth check failed, continuing as regular user");
                setisSeller(false);
            }
            
            try {
                // Finally fetch products
                await fetchProducts();
            } catch (error) {
                console.log("Product fetch failed, using empty product list");
                setProducts({ fruits: [], vegetables: [], bundles: [] });
            }
        };

        initializeApp();
    }, []); // Empty dependency array means it runs once on component mount

    // This effect was causing issues by redirecting to /seller repeatedly
    // We only want to navigate to seller dashboard on initial authentication, not on every render
    useEffect(() => {
        // Only redirect on initial authentication, not when already on a seller page
        if (isSeller && authChecked && !window.location.pathname.includes('/seller')) {
            navigate("/seller");
        }
    }, [isSeller, authChecked]);

    // Calculate Total Cart items
    const getTotalCartItems = () => {
        let total = 0
        for (const quantity of Object.values(cartItems)) {
            total += quantity;
        }
        return total;
    }
    // Calculate Total Cart Price
    const getTotalCartPrice = () => {
        let total = 0;

        // Merge all product arrays into a single array
        const allProducts = [
            ...(products.fruits || []),
            ...(products.vegetables || []),
            ...(products.bundles || [])
        ];

        for (const [itemId, quantity] of Object.entries(cartItems)) {
            const product = allProducts.find(product => product._id === itemId);
            if (product) {
                total += product.offerPrice * quantity;
            }
        }

        return total;
    };


    // Check if user is authenticated
    const checkUserAuth = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get('/api/user/check-auth');
            if (data?.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
            console.error("User auth check failed:", err.response?.data?.message || err.message);
        } finally {
            setIsLoading(false);
            setAuthChecked(true);
        }
    };

    // Load cart from database
    const loadCartFromDB = async () => {
        try {
            if (!user) {
                console.log("No user found, skipping cart load");
                return;
            }
            
            // console.log("Loading cart from database for user:", user._id);
            const response = await axios.get('/api/user/cart');
            // console.log("Cart API response:", response.data);
            
            const cartItemsObj = {};
            
            if (response.data.cartItem && Array.isArray(response.data.cartItem) && response.data.cartItem.length > 0) {
                response.data.cartItem.forEach(item => {
                    // Make sure we're using the correct field name and the item has required properties
                    const productId = item.productId;
                    const quantity = item.quantity;
                    
                    if (productId && quantity && quantity > 0) {
                        cartItemsObj[productId] = quantity;
                        // console.log(`Added to cart: ${productId} x ${quantity}`);
                    } else {
                        console.warn("Invalid cart item:", item);
                    }
                });
                // console.log("Cart loaded from DB:", cartItemsObj);
                // console.log("Total items in cart:", Object.keys(cartItemsObj).length);
            } else {
                console.log("No cart items found in database or invalid cart data");
            }
            
            // Always set the cart items, even if empty
            setCartItems(cartItemsObj);
            // console.log("Cart state updated:", cartItemsObj);
        } catch (error) {
            console.error("Load cart error:", error);
            // If there's an error loading cart, don't clear existing cart
            if (error.response?.status !== 401) {
                console.error("Failed to load cart from database:", error.response?.data?.message || error.message);
            }
        }
    };

    // Clear cart (typically after successful order)
    const clearCart = async () => {
        try {
            if (user) {
                // If user is logged in, clear from database
                await axios.delete('/api/user/cart/clear');
            }
            
            // Clear local cart state
            setCartItems({});
            toast.success("Cart cleared successfully");
        } catch (error) {
            console.error("Clear cart error:", error);
            toast.error(error.response?.data?.message || "Failed to clear cart");
        }
    };

    // Logout user
    const logoutUser = async () => {
        try {
            await axios.get('/api/user/logout');
            setUser(null);
            setCartItems({}); // Clear cart on logout
            toast.success("Logged out successfully");
            navigate('/');
        } catch (err) {
            console.error("Logout failed:", err.response?.data?.message || err.message);
            toast.error("Logout failed. Please try again.");
        }
    };

    // Load cart when user logs in
    useEffect(() => {
        if (user && authChecked) {
            // console.log("User authenticated, loading cart from DB");
            // Add a small delay to ensure all authentication is complete
            setTimeout(() => {
                loadCartFromDB();
            }, 100);
        } else if (!user && authChecked) {
            // Clear cart if user is not authenticated
            console.log("User not authenticated, clearing cart");
            setCartItems({});
        }
    }, [user, authChecked]);

    // get all the value of Context an used in return  blow
    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setisSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        setProducts,
        cartItems,
        addToCart,
        updateCart,
        removeProductFromCart,
        seacrhQuery,
        setSeacrhQuery,
        reviews,
        setReviews,
        reviewForm,
        setReviewForm,
        getTotalCartItems,
        getTotalCartPrice,
        axios,
        fetchSeller,
        checkUserAuth,
        logoutUser,
        loadCartFromDB,
        clearCart,
        isLoading,
        authChecked
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook to use AppContext
export const useAppContext = () => {
    return useContext(AppContext);
};

