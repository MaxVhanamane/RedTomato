import React,{useContext} from "react";
import { AiOutlineHome } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { VscThreeBars } from "react-icons/vsc";
import { AiOutlineShoppingCart } from "react-icons/ai";
import styles from "../styles/Navigation.module.css"
import { useRouter } from 'next/router';
import Link from "next/link";
import { CartContext } from "./../context/CartState";

function Navigation() {
  const {
    toggleCart,
    toggleSidebar,removeToken,clearCart,token
  } = useContext(CartContext);

  return (
    <nav className={styles.nav}>


         
<button   
     className={styles.linkTag  }
        title="sidebar"
      >
         <VscThreeBars
            onClick={toggleSidebar}
            
          />
      </button> 

{/* if you want to show active link add className={styles.linkTag +" " + (currentPath==="/" && styles.active )  } */}
<Link href="/" >
<a   
     className={styles.linkTag }
        title="home"
      >
        <AiOutlineHome />
      </a> 
            </Link>


   


<button   
     className={styles.linkTag}
        title="cart"
      >
         <AiOutlineShoppingCart
            onClick={toggleCart}
           
          />
      </button> 
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
