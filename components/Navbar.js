import React, { useContext, useState,useEffect,useRef} from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiPlusSquare } from "react-icons/fi";
import { IoIosCall } from "react-icons/io";
import { FiMinusSquare } from "react-icons/fi";
import { FaInfoCircle } from "react-icons/fa";
import { GiShoppingBag } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { CartContext } from "./../context/CartState";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from 'next/router';
import Navigation from "./Navigation"
import styles from "../styles/Navigation.module.css"

export default function Navbar() {
  const {
    progress,
    setProgress,
    removeToken,
    cart,
    totalItems,
    Total,
    clearCart,
    removeFromCart,
    addToCart,

    ref,
    toggleCart,
   sidebar,toggleSidebar,changeHamburgerIcon,setChangeHamburgerIcon
  } = useContext(CartContext);
  const [dropDown, setDropDown] = useState(false);
  const [token, setToken] = useState(null);
  const[role,setRole]=useState(null)
  const[user,setUser]=useState(null)
  const router =useRouter()
  const dropDownRef=useRef()
  useEffect(()=>{
    let tokenVal=localStorage.getItem("token")
    let role=localStorage.getItem("role")
    let user=localStorage.getItem("user")
    if(tokenVal && role){
      setToken(tokenVal)
      setRole(role)
      setUser(user)
    }
    else{
      setToken(null)
      setRole(null)
      setUser(null)

    }
  },[token,router.query])

  const handleDropDown=()=>{
    if(dropDownRef.current.classList.contains("hidden")){
      dropDownRef.current.classList.remove("hidden")
    }
    else{
      dropDownRef.current.classList.add("hidden")

    }
  }

  // const ref = useRef();
  // const toggleCart = () => {
  //   if (ref.current.classList.contains("translate-x-full")) {
  //     ref.current.classList.remove("translate-x-full");
  //     ref.current.classList.add("translate-x-0");
  //   } else if (!ref.current.classList.contains("translate-x-full")) {
  //     ref.current.classList.remove("translate-x-0");
  //     ref.current.classList.add("translate-x-full");
  //   }
  // };
  return (
    <>
      <LoadingBar
        color="#f11946"
        progress={progress}
        waitingTime={500}
        onLoaderFinished={() => setProgress(0)}
      />
      <div id="nav">
      {/* <nav className="flex fixed flex-col z-50 w-full  p-2 justify-start  items-center md:flex-row sm:flex-col  md:justify-start md:items-center bg-[#FC6A03]   "> */}
      <div className="md:hidden">
      <div className={`${styles.imageContainer}`}>
          <Image src="/assets/logo8.png" className={styles.image} alt="logo" layout="fill" />
          {/* <img src="/assets/logo.png" alt="logo" width={120} height={25}  /> */}
        </div>
        </div>

      <nav
        className="
    
            
            bg-gray-100

 
              shadow-lg
  
         md:flex fixed flex-col z-50 w-full   justify-start  items-center md:flex-row sm:flex-col  md:justify-start md:items-center "
      >
        {/* bg-gradient-to-r from-pink-500 to-yellow-500 bg-[#FC6A03]*/}
        
        <div className=" hidden md:flex ml-2 mr-6 ">
          <Image src="/assets/logo.png" alt="logo"  objectFit="contain" width={130} height={45} quality={100}  />
          {/* <img src="/assets/logo.png" alt="logo" width={120} height={25}  /> */}
        </div>


        <div className="hidden md:flex p-4" >
          <ul className="flex md:gap-8 gap-2 md:flex-row sm:flex-row flex-row mt-4 md:mt-0 ">
            <Link passHref href="/">
            {/* To show active path in red color ${router.pathname==="/about" && "text-red-500"}  focus:text-red-500 doesn't work when I 
            refresh the page.*/}
              <a className={`text-gray-500 hover:text-gray-700  ${router.pathname==="/" && "text-red-500"} focus:text-red-500`}>
                <li>Home</li>
              </a>
            </Link>
         
            <Link passHref href="/veg">
              <a className={`text-gray-500 hover:text-gray-700  ${router.pathname==="/veg" && "text-red-500"} focus:text-red-500`}>
                <li>Veg</li>
              </a>
            </Link>
            <Link passHref href="/nonveg">
              <a className={`text-gray-500 hover:text-gray-700  ${router.pathname==="/nonveg" && "text-red-500"} focus:text-red-500`}>
                <li>Non veg</li>
              </a>
            </Link>
            <Link passHref href="/about">
              <a className={`text-gray-500 hover:text-gray-700  ${router.pathname==="/about" && "text-red-500"} focus:text-red-500`}>
                <li>About us</li>
              </a>
            </Link>
          </ul>
        </div>



        <div className=" hidden md:flex items-center justify-center cursor-pointer  absolute right-4 mt-1 ">
          {!token && (
            <Link passHref href="/login">
              <button className={`h-8 w-16 mr-2 ${router.pathname==="/login" && "text-red-500"} text-center text-gray-500 hover:text-gray-700 rounded-lg  `}>
                Login
              </button>
            </Link>
          )}
          {token && (
            <FaUserAlt
              onMouseOver={() => {
                setDropDown(true);
              }}
              onMouseLeave={() => {
                setDropDown(false);
              }}
              className=" text-gray-500  focus:text-red-500 text-lg mr-6 sm:mr-4 "
            />
          )}
          {dropDown && (
            <div
              onMouseOver={() => {
                setDropDown(true);
              }}
              onMouseLeave={() => {
                setDropDown(false);
              }}
              className="absolute right-12  top-5 bg-gray-100 p-2 rounded shadow-2xl "
              // from-[#FC6A03] to-[#ffffff]
            >
              <ul>
             {token&&role==="admin" && <Link passHref href="/dashboard/viewall">
                  <li className="p-2 whitespace-nowrap text-gray-600 hover:text-red-500">
                    Dashboard
                  </li>
                </Link>}
                <Link passHref href="/myaccount">
                  <li className="p-2 whitespace-nowrap text-gray-600 hover:text-red-500">
                    My Account
                  </li>
                </Link>
                <Link passHref href={`/orders?email=${user}`}>
                  <li className="p-2 text-gray-600 hover:text-red-500">My Orders</li>
                </Link>
                <li
                  onClick={() => {
                    const con=confirm("Do you really want to logout?")
                    if(con){
                      removeToken();
                      clearCart();
                      localStorage.removeItem("user");
                      localStorage.removeItem("role");
                    }
                   
                  }}
                  className="p-2 text-gray-600 hover:text-red-500"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
          <AiOutlineShoppingCart
            onClick={toggleCart}
            className=" text-red-500 hover:text-red-600 p-1 focus:text-red-500 md:text-3xl  text-3xl border-solid border-2 border-gray-300 rounded-md"
            title="cart"
          />
         
        </div>
       {totalItems>0? <div><span className="hidden animate-[ping_1s_ease-in-out_2] absolute right-3 top-2 md:inline-block w-4 h-4  rounded-full bg-red-500 opacity-75"></span><p className="hidden md:inline-block absolute right-3 top-2 rounded-full bg-red-600 w-4 h-4  p-0 m-0 text-white font-mono text-xs   text-center">{totalItems}</p></div>:null}

        {/* bg-gradient-to-r from-[red] to-[#ffffff] */}
        <div
          ref={ref}
          
          className=" h-96 overflow-y-scroll  shadow-md rounded-sm w-full sidebar md:w-fit absolute top-0 right-0 bg-gray-100  p-10 transform transition-transform translate-x-full duration-300 "
        >
          <h2 className="font-bold lg:text-xl  text-center text-base  text-gray-900 ">My cart</h2>
          <span
            onClick={toggleCart}
            className="absolute top-3 right-2 cursor-pointer text-xl flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75  group-hover:text-gray-900 "
          >
            <AiFillCloseCircle />
          </span>
          {Object.keys(cart).length == 0 && (
            <div>
            <p className="text-center">Your cart is empty</p>
            <p className="text-center">Add some items to checkout</p>
            </div>
          )}
          <ol className="  my-2 font-semibold">
            {Object.keys(cart).map((key) => {
              return (
                <li key={key}>
              
                  <div className=" flex items-center mt-3 justify-center gap-1">
                  <div className={`${styles.cartimageContainer}`}>
                    
                  <span className=" absolute -right-1 -top-1 rounded-full leading-4 bg-red-600 w-4 h-4 text-white font-mono text-xs align-middle  text-center z-[20]"><span>{cart[key].qty}</span></span>
          <Image src={cart[key].img} alt="food image" className={`${styles.image}`} layout="fill" />
                    </div>
                    <div className="md:w-[18rem] w-[50%] pl-4 font-semibold text-gray-800">

         
               {key}

        </div>
                    <div className="flex w-1/3 font-semibold items-center justify-center">
                      <FiMinusSquare
                        className="text-xl text-gray-800 "
                        onClick={() => {
                          removeFromCart(
                            cart[key].slug,
                            1,
                            cart[key].price,
                            key,
                            cart[key].size,
                            cart[key].type,
                            cart[key].img
                          );
                        }}
                      />

                      <span className="m-2 w-2">{cart[key].qty}</span>

                      <FiPlusSquare
                        className="text-xl text-gray-800 "
                        onClick={() => {
                          addToCart(
                            cart[key].slug,
                            1,
                            cart[key].price,
                            key,
                            cart[key].size,
                            cart[key].type,
                            cart[key].img
                          );
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          {Object.keys(cart).length > 0 && (
            <div className="font-bold text-lg text-gray-700 mt-4 ">Total : ₹{Total}</div>
          )}
          <div className="flex text-center items-left justify-center mt-4">
            <Link passHref href="/checkout">
              <button
              onClick={toggleCart}
                disabled={Object.keys(cart).length == 0}
                className="bg-gray-200 mr-6 outline-none  disabled:bg-gray-300 hover:bg-gray-300 disabled:text-gray-500 text-gray-800 font-bold  px-1 rounded inline-flex items-center"
              >
                <span className="fill-current w-2  mr-2">
                  <GiShoppingBag className=" flex justify-center items-center text-center" />{" "}
                </span>
                <span>Checkout</span>
              </button>
            </Link>
            <button
              onClick={clearCart}
              disabled={Object.keys(cart).length == 0}
              className="bg-red-600 outline-none disabled:bg-gray-400 hover:bg-red-700 text-gray-100 font-bold px-1 rounded inline-flex items-center"
            >
              <span className="fill-current w-2 mr-2">
                <MdDelete />{" "}
              </span>
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

{/* Sidebar  */}
        {/* <div
          ref={sidebar}
          
          className="  h-screen overflow-y-scroll  shadow-md rounded-sm  sidebar w-full absolute top-0 left-0 bg-gray-100 p-10 transform transition-transform -translate-x-full "
        >
          <h2 className="font-bold text-xl text-center">Menu</h2>
          <hr className="mt-2"></hr>
              <div className="mt-8">
          <h2 className="font-bold text-sm">1. Category</h2>
                
                <ol className="list-none font-semibold">
                  <Link href="/veg">
                <li onClick={toggleSidebar} className="flex items-center my-4 hover:bg-gray-200"><GiFruitBowl className="mr-2 text-green-600"/>Veg food</li></Link>
                <Link href="/nonveg">
                  <li onClick={toggleSidebar} className="flex items-center my-4 hover:bg-gray-200"><GiChickenOven className="mr-2 text-red-600"/>Non veg food</li>
                 </Link>
                </ol>
                </div>

              {token&&<div className="mt-8">
          <h2 className="font-bold text-sm">2. Account</h2>

                <ol className="list-none font-semibold">
                <Link href="/myaccount">
                <li onClick={toggleSidebar} className="flex items-center my-4 hover:bg-gray-200"><GiFruitBowl className="mr-2 text-green-600"/>My account</li>
                  </Link> 
                <Link href="/orders">

                  <li onClick={toggleSidebar} className="flex items-center my-4 hover:bg-gray-200"><GiChickenOven className="mr-2 text-red-600"/>My orders</li>
                  </Link> 

                <Link href="/contact">

                  <li onClick={toggleSidebar} className="flex items-center my-4 hover:bg-gray-200"><IoIosCall className="mr-2 text-blue-500"/>Contact us</li>
                  </Link> 

                  <Link href="/about">

                  <li onClick={toggleSidebar} className="flex items-center my-4 hover:bg-gray-200 "><FaInfoCircle className="mr-2 text-blue-600 "/>About us</li>
                  </Link> 
                 
                </ol>
                </div>}
          <span
            onClick={toggleSidebar}
            className="absolute top-3 right-2 cursor-pointer text-xl"
          >
            <AiFillCloseCircle />
          </span>
          
         
        
        </div> */}

{/* Sidebar  */}

<aside ref={sidebar} className=" overflow-y-scroll  shadow-md rounded-sm  sidebar w-80 absolute top-0 left-0 bg-gray-100 transform transition-transform -translate-x-full duration-300" aria-label="Sidebar">
   <div className="overflow-y-auto py-8 px-3 bg-gray-50  ">
    <p className="text-center mb-2 text-gray-900 font-semibold">Menu</p>
      <ul className="space-y-2">
      {(token && role==="admin") && 
         <li onClick={()=>{toggleSidebar();setChangeHamburgerIcon(!changeHamburgerIcon)}}>
            <Link passHref href="/dashboard/viewall"><a  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 ">
               <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75  group-hover:text-gray-900 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
               <span className="ml-3">Dashboard</span>
            </a></Link>
         </li>
        }
         <li>
            <button  onClick={handleDropDown} type="button" className="flex outline-none items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100  " aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                    <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  <span className="flex-1 ml-3 text-left whitespace-nowrap" sidebar-toggle-item="">Category</span>
                  <svg sidebar-toggle-item="" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
            <ul id="dropdown-example" ref={dropDownRef} className="hidden  py-2 space-y-2">
            
                  <li onClick={()=>{toggleSidebar();setChangeHamburgerIcon(!changeHamburgerIcon);handleDropDown()}}>
                  <Link passHref href="/veg"><a  className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100  ">Veg</a></Link>
                  </li>
                  
                  
                  <li onClick={()=>{toggleSidebar();setChangeHamburgerIcon(!changeHamburgerIcon);handleDropDown()}}>
                  <Link passHref href="/nonveg"><a  className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 ">Non Veg</a></Link>
                  </li>
                  
               
            </ul>
         </li>
        {token&& 
         <li onClick={()=>{toggleSidebar();setChangeHamburgerIcon(!changeHamburgerIcon)}}>
            <Link passHref href="/myaccount"><a  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 ">
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">My Account</span>
            </a></Link>
         </li>
        }
        
        

         {token&& 
         <li onClick={()=>{toggleSidebar();setChangeHamburgerIcon(!changeHamburgerIcon)}}>
            <Link passHref href={`/orders?email=${user}`}><a  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 ">
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75  group-hover:text-gray-900 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">My orders</span>
            </a></Link>
         </li>
         }
         
         <li onClick={()=>{toggleSidebar();setChangeHamburgerIcon(!changeHamburgerIcon)}}>
         <Link passHref href="/contact"><a  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 ">
             
               <IoIosCall className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75  group-hover:text-gray-900 "/>
               <span className="flex-1 ml-3 whitespace-nowrap">Contact us</span>
            </a></Link>
         </li>
         
         
         <li onClick={()=>{toggleSidebar();setChangeHamburgerIcon(!changeHamburgerIcon)}}>
         <Link passHref href="/about"><a  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 ">
        
               <FaInfoCircle className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75  group-hover:text-gray-900 "/>
               <span className="flex-1 ml-3 whitespace-nowrap">About us</span>
            </a></Link>
         </li>
         
      </ul>
      {!token?<p className=" text-xs text-gray-400 mt-12 ml-3">Login to see your orders.</p>:null}
   </div>
   <span
            onClick={()=>{toggleSidebar();setChangeHamburgerIcon(!changeHamburgerIcon)}}
            className="absolute top-3 right-2 cursor-pointer text-xl flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75  group-hover:text-gray-900 "
          >
            <AiFillCloseCircle />
          </span>
</aside>

  





      </nav>
      <div className="md:hidden">

 {/* navigation bar at the bottom on the mobile devices  */}
    <Navigation  />
      </div>
</div>
    </>
  );
}
