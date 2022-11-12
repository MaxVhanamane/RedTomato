import React,{useContext} from "react";
import { AiOutlineHome } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { VscThreeBars } from "react-icons/vsc";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import styles from "../styles/Navigation.module.css"
import Link from "next/link";
import { CartContext } from "./../context/CartState";

function Navigation() {
  const {
    toggleCart,
    toggleSidebar,removeToken,clearCart,token,totalItems,
    changeHamburgerIcon,setChangeHamburgerIcon
  } = useContext(CartContext);

  return (
    <nav className={styles.nav}>


         
{changeHamburgerIcon?<button   
     className={styles.linkTag  }
        title="sidebar"
      >
         <VscThreeBars
            onClick={()=>{toggleSidebar();setChangeHamburgerIcon(!changeHamburgerIcon)}}
            
          />
      </button> :
<button   
     className={styles.linkTag  }
        title="sidebar"
      >
         <AiOutlineClose
            onClick={()=>{toggleSidebar();setChangeHamburgerIcon(!changeHamburgerIcon)}}
            
          />
      </button> }

{/* if you want to show active link add className={styles.linkTag +" " + (currentPath==="/" && styles.active )  } */}
<Link href="/" >
<a   
     className={styles.linkTag }
        title="home"
      >
        <AiOutlineHome />
      </a> 
            </Link>


   

<div className="relative">
<button   
     className={styles.linkTag}
        title="cart"
      >
         <AiOutlineShoppingCart
            onClick={toggleCart}
           
          />
      </button> 
{totalItems>0? <div><span className=" animate-[ping_1s_ease-in-out_2] absolute right-1 top-2 inline-flex w-4 h-4  rounded-full bg-red-500 opacity-50"></span><p className=" md:inline-block absolute right-1 top-2 rounded-full bg-red-600 w-4 h-4  p-0 m-0 text-white font-mono text-xs   text-center">{totalItems}</p></div>:null}</div>
      {/* If token available then show logout button else show login button */}
     {!token ? <Link href="/login" >
<a   
     className={styles.linkTag }
        title="login"
      >
        <FaUserCircle />
      </a> 
            </Link>

     : <button aria-label="Logout"  
                  className="outline-none"
                  onClick={() => {
                   let confirmLogout= confirm("Are you sure you want to logout?")
                   if(confirmLogout) {removeToken();
                    clearCart();
                    localStorage.removeItem("user");
                   }
                  }}
                  
                >
                  <AiOutlineLogout className=" text-red-500 text-2xl"/>
               
            </button>}

   
           

   
    
    </nav>
  );
}

export default Navigation;
