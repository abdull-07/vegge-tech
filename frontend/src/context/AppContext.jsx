import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productsData } from "../assets/productsdata.js";
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
            setProducts({ fruits: [], vegetables: [], bundles: []  });
        }
    }

    // Add to Cart
    const addToCart = (itemId) => {
        setCartItems(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
        toast.success("Item added to cart");
    }

    // Update Cart
    const updateCart = (itemId, quantity) => {
        if (quantity > 0) {
            setCartItems(prev => ({
                ...prev,
                [itemId]: quantity
            }));
            toast.success("Cart updated");
        } else {
            removeProductFromCart(itemId);
        }
    }

    //  Remove Product from Cart
    const removeProductFromCart = (itemId) => {
        setCartItems(prev => {
            const newCart = { ...prev };
            delete newCart[itemId];
            return newCart;
        });
        toast.success("Item removed from cart");
    }

    useEffect(() => {
        const initializeApp = async () => {
            // Check user authentication first
            await checkUserAuth();
            
            // Then check seller authentication
            await fetchSeller();
            
            // Finally fetch products
            await fetchProducts();
        };
        
        initializeApp();
    }, []); // Empty dependency array means it runs once on component mount
    
    // Navigate to seller dashboard if user is a seller
    useEffect(() => {
        if (isSeller && authChecked) {
            navigate("/seller");
        }
    }, [isSeller, authChecked, navigate]);

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
            ...(products.deals || [])
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

    // Logout user
    const logoutUser = async () => {
        try {
            await axios.get('/api/user/logout');
            setUser(null);
            toast.success("Logged out successfully");
            navigate('/');
        } catch (err) {
            console.error("Logout failed:", err.response?.data?.message || err.message);
            toast.error("Logout failed. Please try again.");
        }
    };

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
        isLoading,
        authChecked
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook to use AppContext
export const useAppContext = () => {
    return useContext(AppContext);
};

