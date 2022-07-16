import React, { useRef, useContext,useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsCart4 } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiPlusSquare } from "react-icons/fi";
import { FiMinusSquare } from "react-icons/fi";
import { GiShoppingBag } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { CartContext } from "./../context/CartState";
import LoadingBar from 'react-top-loading-bar'

export default function Navbar() {
  const {progress,setProgress, token,removeToken,cart,Total, clearCart, removeFromCart, addToCart } =
    useContext(CartContext);
 const [dropDown,setDropDown]=useState(false)
  const ref = useRef();
  const toggleCart = () => {
    if (ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-full");
      ref.current.classList.add("translate-x-0");
    } else if (!ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-0");
      ref.current.classList.add("translate-x-full");
    }
  };
  return (
    <>     <LoadingBar
    color='#f11946'
    progress={progress}
    waitingTime={500}
    onLoaderFinished={() => setProgress(0)}
  />
    <div className="flex fixed flex-col z-50 w-full  p-2 justify-start  items-center md:flex-row sm:flex-col  md:justify-start md:items-center bg-[#FC6A03] bg-gradient-to-r from-pink-500 to-yellow-500 ">
      <div className="logo ml-2 mr-6">
        {/* <Image src="/assets/logo.png" alt="logo" width={120} height={45} /> */}
        Your Chef
      </div>
      <div>
        <ul className="flex  text-white   md:gap-8 gap-2 md:flex-row sm:flex-row flex-row mt-4 md:mt-0 font-bold text-xl">
          <Link href="/">
            <a>
              <li>Home</li>
            </a>
          </Link>
          <Link href="/about">
            <a>
              <li>About</li>
            </a>
          </Link>
          <Link href="/veg">
            <a>
              <li>Veg</li>
            </a>
          </Link>
          <Link href="/nonveg">
            <a>
              <li>Non veg</li>
            </a>
          </Link>
        </ul>
      </div>
      <div
        
        className=" flex items-center justify-center cursor-pointer  absolute right-4 mt-1 "
      >
         {!token &&<Link href="/login"><button className="h-8 w-16 mr-2 text-center text-white rounded-lg  hover:text-black">
                    Login
                  </button></Link>}
       {token && <FaUserAlt onMouseOver={()=>{setDropDown(true)}} onMouseLeave={()=>{setDropDown(false)}} className=" text-white text-lg mr-4"/>}
       { dropDown && <div onMouseOver={()=>{setDropDown(true)}} onMouseLeave={()=>{setDropDown(false)}}  className="absolute right-12  top-5 bg-gradient-to-l from-white to-yellow-500 p-2 rounded shadow-2xl ">
        <ul>
        <Link href="/myaccount" ><li  className="p-2 whitespace-nowrap hover:text-white">My Account</li></Link>
          <Link href="/orders" ><li className="p-2 hover:text-white">Orders</li></Link>
          <li onClick={removeToken} className="p-2 hover:text-white">Logout</li>
        </ul>
       </div>}
        <BsCart4 onClick={toggleCart} className="md:text-2xl text-2xl text-white hover:text-black" />
      </div>
      <div
        ref={ref}
        className="  h-96 overflow-y-scroll   sidebar w-80 absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-yellow-500 p-10 transform transition-transform translate-x-full"
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
              <li  key={key}>
                <div className=" flex items-center">
                  <div className="w-2/3 font-semibold">{key}</div>
                  <div className="flex w-1/3 font-semibold items-center justify-center">
                    <FiMinusSquare
                      className="text-xl"
                      onClick={() => {
                        removeFromCart(cart[key].slug,1,cart[key].price,key,cart[key].size,cart[key].type);
                      }}
                    />

                    <span className="m-2">{cart[key].qty}</span>

                    <FiPlusSquare
                      className="text-xl"
                      onClick={() => {
                        addToCart(cart[key].slug,1,cart[key].price,key,cart[key].size,cart[key].type);
                      }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        {Object.keys(cart).length>0 && <div className="font-bold text-lg">Total : {Total}</div>}
        <div className="flex text-center mt-4">
         <Link href="/checkout"><button className="bg-gray-300 mr-6 hover:bg-gray-400 text-gray-800 font-bold  px-1 rounded inline-flex items-center">
            <span className="fill-current w-2  mr-2">
              <GiShoppingBag className=" flex justify-center items-center text-center" />{" "}
            </span>
            <span>Checkout</span>
          </button></Link>
          <button
            onClick={clearCart}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-1 rounded inline-flex items-center"
          >
            <span className="fill-current w-2 mr-2">
              <MdDelete />{" "}
            </span>
            <span>Clear Cart</span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
