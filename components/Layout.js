import Footer from "./Footer"
import Navbar from "./Navbar"
import {useContext,useEffect} from "react";
import { CartContext } from './../context/CartState';
import {useRouter} from "next/router"
export default function Layout({children}) {
  const router= useRouter()
  const {
  
    clearCart,
   
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
    localStorage.removeItem("role")
     alert("Token expired : \n please login again to refresh your token.")
    }
    else{
      // If someone changed the role in localStorage then we will reset it here.
      localStorage.setItem("role",response.role)
    }
    })()}
   
  
  
   
  },[router.query])
    return (
      <div className='h-screen'>
   <Navbar />
        {children}
        <Footer/>
      </div>
    )
  }
  