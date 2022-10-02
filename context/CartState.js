import React, { useEffect,useRef } from "react";

// import NoteContext from "./NoteContext"
import { createContext, useState } from "react";
import { useRouter } from "next/router";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// creating context object and exporting it.
export const CartContext = createContext();

function CartState(props) {
  const [cart, setCart] = useState({});
  const [Total, setTotal] = useState(0);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [cartChange,setCartChange]=useState(Math.random())
  const sidebar=useRef()
  const ref=useRef()
  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart)); //as we can't store object's in localStorage so let's convert it in JSON string
    let subTotal = 0;
    let keys = Object.keys(myCart); // returns an array of keys.

    for (let i = 0; i < keys.length; i++) {
      subTotal += myCart[keys[i]].price * myCart[keys[i]].qty;

      setTotal(subTotal);
    }
  };

  useEffect(() => {
    router.events.on('routeChangeStart', ()=>{
      setProgress(40)
    })
    router.events.on('routeChangeComplete', ()=>{
      setProgress(100)
    })
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart"))) // We have to call saveCart in useEffect because If we don't call it here
        // the Total cost will show zero in cart after reloading the page to avoid that I am calling it in useEffect.
      }
    } catch (error) {
      localStorage.clear();
    }
    const token=localStorage.getItem("token");
    if (token){
      setToken(token)
    }
  }, [router.events,router.query]);
// router.query will make this useEffect run on every route change.
  // add to cart
  const addToCart = (slug, qty, price, name, size, type) => {
    const newCart = JSON.parse(JSON.stringify(cart));
    if (name in cart) {
      newCart[name].qty = cart[name].qty + qty;
    } else {
      newCart[name] = { slug,qty: 1, price, size, type };
    }
    setCart(newCart);
    saveCart(newCart);
    setCartChange(Math.random())

  };

  // delete items from cart
  const removeFromCart = (slug, qty, price, name, size, type) => {
    const newCart = JSON.parse(JSON.stringify(cart)); // You need to parse the cart otherwise state change will not re-render the navbar or any component using cart as a state. if you write only" const newCart=cart" then you will notice while removing items from cart when it reaches to 1 it will not remove further it will just throw an error.
    
    if (name in cart) {
      newCart[name].qty = cart[name].qty - qty;
      
    }
 
    if (newCart[name]["qty"] <= 0) {
      delete newCart[name];
    
    }

    setCart(newCart);
    saveCart(newCart);
    setCartChange(Math.random())

  };

  // clear cart
  const clearCart = () => {
    setCart({});
    saveCart({});
    setCartChange(Math.random())
  };
 
  const orderNow=(slug, qty, price, name, size, type)=>{
  
    let  newCart={[`${name}`]:{slug, qty, price, size, type}}
    setCart(newCart)
    saveCart(newCart)
    router.push("/checkout")
  }

  const removeToken=()=>{
    localStorage.removeItem("token")
    setToken(null)
    router.push("/")
    toast.success('Logged out successfully!', {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  const toggleCart = () => {
    if (ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-full");
      ref.current.classList.add("translate-x-0");
    } else if (!ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-0");
      ref.current.classList.add("translate-x-full");
    }
  };
  const toggleSidebar = () => {
    if (sidebar.current.classList.contains("-translate-x-full")) {
      sidebar.current.classList.remove("-translate-x-full");
      sidebar.current.classList.add("translate-x-0");
    } else if (!sidebar.current.classList.contains("-translate-x-full")) {
      sidebar.current.classList.remove("translate-x-0");
      sidebar.current.classList.add("-translate-x-full");
    }
  };
  return (
    <CartContext.Provider
      value={{ progress,setProgress,token,removeToken,cart, Total, addToCart, removeFromCart, clearCart,orderNow,ref,toggleCart,cartChange,setCartChange ,sidebar,toggleSidebar}}
    >
      {/* Provider will give access to all the above states and functions to the components which are in props.children */}
      {props.children}
    </CartContext.Provider>
  );
}

export default CartState;
