import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {productsData} from "../assets/productsdata.js";
import toast from "react-hot-toast";


// Create Context
export const AppContext = createContext();

// AppContextProvider Component
export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setisSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState(productsData);
    const [cartItems, setCartItems] = useState({});
    const [seacrhQuery, setSeacrhQuery] = useState("");
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });

    // Fetch Products
    const fetchProducts = async () => {
        setProducts(productsData)
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
        fetchProducts()
    }, [])

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


    // get all the value of Context an used in return  blow
    const value = {
        navigate, user, setUser, isSeller, setisSeller, showUserLogin, setShowUserLogin, products, setProducts, cartItems, addToCart, updateCart, 
        removeProductFromCart, seacrhQuery, setSeacrhQuery, reviews, setReviews, reviewForm, setReviewForm, getTotalCartItems, getTotalCartPrice
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook to use AppContext
export const useAppContext = () => {
    return useContext(AppContext);
};

