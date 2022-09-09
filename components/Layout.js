import Footer from "./Footer"
import Navbar from "./Navbar"
import {useContext,useEffect,useState} from "react";
import { useRouter } from 'next/router';
import { CartContext } from './../context/CartState';
export default function Layout({children}) {
  const router =useRouter()
  const {
    progress,
    setProgress,
    removeToken,
    cart,
    Total,
    clearCart,
    removeFromCart,
    addToCart,
    ref,
    toggleCart,
    cartChange,
    setCartChange,sidebar,toggleSidebar
  } = useContext(CartContext);
  useEffect(()=>{
    let token = localStorage.getItem("token");
    const data = { token};
    
    if(token){(async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/verifyauthexptime`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const response = await res.json()
    if(!response.success){
    clearCart()
    localStorage.removeItem("user")
    localStorage.removeItem("token")
     alert("Token expired \n please login again to refresh your token.")
    }
    })()}
   
  
  
   
  })
    return (
      <div className='h-screen'>
   <Navbar />
        {children}
        <Footer/>
      </div>
    )
  }
  