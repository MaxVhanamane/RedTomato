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
    changeHamburgerIcon,setChangeHamburgerIcon,toggleCartForNavIcons,toggleSidebarForNavIcons
  } = useContext(CartContext);

  return (
    <nav className={styles.nav}>


         
{changeHamburgerIcon?<button   
     className={styles.linkTag  }
        title="sidebar"
      >
         <VscThreeBars
            onClick={()=>{toggleSidebar();
              setChangeHamburgerIcon(!changeHamburgerIcon);
              toggleCartForNavIcons();
              
            }}
            
          />
      </button> :
<button   
     className={styles.linkTag  }
        title="sidebar"
      >
         <AiOutlineClose
            onClick={()=>{toggleSidebar();setChangeHamburgerIcon(!changeHamburgerIcon);toggleCartForNavIcons()}}
            
          />
      </button> }

{/* if you want to show active link add className={styles.linkTag +" " + (currentPath==="/" && styles.active )  } */}
<Link href="/" >
<a   
     className={styles.linkTag }
        title="home"
      >
        <AiOutlineHome onClick={()=>{toggleSidebarForNavIcons();
          toggleCartForNavIcons();if(!changeHamburgerIcon){setChangeHamburgerIcon(true)}}}/>
      </a> 
            </Link>


   

<div className="relative">
<button   
     className={styles.linkTag}
        title="cart"
      >
         <AiOutlineShoppingCart
            onClick={()=>{toggleCart();toggleSidebarForNavIcons();
              if(!changeHamburgerIcon){setChangeHamburgerIcon(true)}}}
           
          />
      </button> 
{totalItems>0? <div><span className= {`animate-[ping_1s_ease-in-out_2] absolute right-1 top-2 inline-flex w-4 h-4  rounded-full bg-red-500 opacity-50 ${totalItems>99 && "w-6 rounded-md"}`}></span><p className={`md:inline-block absolute right-1 top-2 rounded-full bg-red-600 leading-4 w-4 h-4  p-0 m-0 text-white font-mono text-xs text-center ${totalItems>99 && "w-6 rounded-md"}`}>{totalItems<100?<span className="leading-4 text-center">{totalItems}</span>:<span className="leading-4 text-center">99+</span>}</p></div>:null}</div>
      {/* If token available then show logout button else show login button */}
     {!token ? <Link href="/login" >
<a   
     className={styles.linkTag }
        title="login"
      >
        <FaUserCircle  onClick={()=>{toggleSidebarForNavIcons();
          toggleCartForNavIcons();if(!changeHamburgerIcon){setChangeHamburgerIcon(true)}}}/>
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
