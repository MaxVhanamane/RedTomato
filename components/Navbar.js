import React, { useRef, useContext, useState,useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiPlusSquare } from "react-icons/fi";
import { IoIosCall } from "react-icons/io";
import { FiMinusSquare } from "react-icons/fi";
import { FaInfoCircle } from "react-icons/fa";
import { GiShoppingBag } from "react-icons/gi";
import { GiChickenOven } from "react-icons/gi";
import { GiFruitBowl } from "react-icons/gi";
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
    Total,
    clearCart,
    removeFromCart,
    addToCart,
    ref,
    toggleCart,
    cartChange,
    setCartChange,sidebar,toggleSidebar
  } = useContext(CartContext);
  const [dropDown, setDropDown] = useState(false);
  const [token, setToken] = useState("");
  const router =useRouter()

  useEffect(()=>{
    let t=localStorage.getItem("token")
    if(t){
      setToken(t)
    }
    else{
      setToken(null)
    }
  },[token,router.query])

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
      {/* <nav className="flex fixed flex-col z-50 w-full  p-2 justify-start  items-center md:flex-row sm:flex-col  md:justify-start md:items-center bg-[#FC6A03]   "> */}
      <div className="md:hidden">
      <div className={`${styles.imageContainer}`}>
          <img src="/assets/logo8.png" className={styles.image} alt="logo" layout="fill" />
          {/* <img src="/assets/logo.png" alt="logo" width={120} height={25}  /> */}
        </div>
        </div>

      <nav
        className="
 
            
            bg-gray-100

 
              shadow-lg
  
         md:flex fixed flex-col z-50 w-full   justify-start  items-center md:flex-row sm:flex-col  md:justify-start md:items-center"
      >
        {/* bg-gradient-to-r from-pink-500 to-yellow-500 bg-[#FC6A03]*/}
        
        <div className=" hidden md:flex ml-2 mr-6 ">
          <Image src="/assets/logo.png" alt="logo"  objectFit="contain" width={120} height={40}  />
          {/* <img src="/assets/logo.png" alt="logo" width={120} height={25}  /> */}
        </div>


        <div className="hidden md:flex p-4" >
          <ul className="flex md:gap-8 gap-2 md:flex-row sm:flex-row flex-row mt-4 md:mt-0 ">
            <Link href="/">
            {/* To show active path in red color ${router.pathname==="/about" && "text-red-500"}  focus:text-red-500 doesn't work when I 
            refresh the page.*/}
              <a className={`text-gray-500 hover:text-gray-700 active:text-red-500 ${router.pathname==="/" && "text-red-500"} focus:text-red-500`}>
                <li>Home</li>
              </a>
            </Link>
         
            <Link href="/veg">
              <a className={`text-gray-500 hover:text-gray-700 active:text-red-500 ${router.pathname==="/veg" && "text-red-500"} focus:text-red-500`}>
                <li>Veg</li>
              </a>
            </Link>
            <Link href="/nonveg">
              <a className={`text-gray-500 hover:text-gray-700 active:text-red-500 ${router.pathname==="/nonveg" && "text-red-500"} focus:text-red-500`}>
                <li>Non veg</li>
              </a>
            </Link>
            <Link href="/about">
              <a className={`text-gray-500 hover:text-gray-700 active:text-red-500 ${router.pathname==="/about" && "text-red-500"} focus:text-red-500`}>
                <li>About us</li>
              </a>
            </Link>
          </ul>
        </div>



        <div className=" hidden md:flex items-center justify-center cursor-pointer  absolute right-4 mt-1 ">
          {!token && (
            <Link href="/login">
              <button className="h-8 w-16 mr-2 text-center text-gray-500 hover:text-gray-700 rounded-lg  ">
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
              className=" text-gray-500 hover:text-gray-700 focus:text-red-500 text-lg mr-6 sm:mr-4 "
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
              className="absolute right-12  top-5 bg-gradient-to-r from-[red] to-[#ffffff] p-2 rounded shadow-2xl "
              // from-[#FC6A03] to-[#ffffff]
            >
              <ul>
                <Link href="/myaccount">
                  <li className="p-2 whitespace-nowrap hover:text-white">
                    My Account
                  </li>
                </Link>
                <Link href="/orders">
                  <li className="p-2 hover:text-white">My Orders</li>
                </Link>
                <li
                  onClick={() => {
                    const con=confirm("do you really want to logout?")
                    if(con){
                      removeToken();
                      clearCart();
                      localStorage.removeItem("user");
                    }
                   
                  }}
                  className="p-2 hover:text-white"
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


        
        <div
          ref={ref}
          
          className=" h-96 overflow-y-scroll  shadow-md rounded-sm  sidebar w-80 absolute top-0 right-0 bg-gradient-to-r from-[red] to-[#ffffff] p-10 transform transition-transform translate-x-full "
        >
          <h2 className="font-bold text-xl text-center">My cart</h2>
          <span
            onClick={toggleCart}
            className="absolute top-3 right-2 cursor-pointer text-xl"
          >
            <AiFillCloseCircle />
          </span>
          {Object.keys(cart).length == 0 && (
            <p className="text-center">Your cart is empty</p>
          )}
          <ol className=" list-decimal my-2 font-semibold">
            {Object.keys(cart).map((key) => {
              return (
                <li key={key}>
                  <div className=" flex items-center">
                    <div className="w-2/3 font-semibold">{key}</div>
                    <div className="flex w-1/3 font-semibold items-center justify-center">
                      <FiMinusSquare
                        className="text-xl"
                        onClick={() => {
                          removeFromCart(
                            cart[key].slug,
                            1,
                            cart[key].price,
                            key,
                            cart[key].size,
                            cart[key].type
                          );
                        }}
                      />

                      <span className="m-2">{cart[key].qty}</span>

                      <FiPlusSquare
                        className="text-xl"
                        onClick={() => {
                          addToCart(
                            cart[key].slug,
                            1,
                            cart[key].price,
                            key,
                            cart[key].size,
                            cart[key].type
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
            <div className="font-bold text-lg">Total : {Total}</div>
          )}
          <div className="flex text-center mt-4">
            <Link href="/checkout">
              <button
                disabled={Object.keys(cart).length == 0}
                className="bg-gray-300 mr-6 disabled:bg-gray-400 hover:bg-gray-200 text-gray-800 font-bold  px-1 rounded inline-flex items-center"
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
              className="bg-gray-300 disabled:bg-gray-400 hover:bg-gray-200 text-gray-800 font-bold px-1 rounded inline-flex items-center"
            >
              <span className="fill-current w-2 mr-2">
                <MdDelete />{" "}
              </span>
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

{/* Sidebar  */}
        <div
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
          
         
        
        </div>
  





      </nav>
      <div className="md:hidden">

 {/* navigation bar at the bottom on the mobile devices  */}
    <Navigation  />
      </div>

    </>
  );
}
