import React, { useRef, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsCart4 } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiPlusSquare } from "react-icons/fi";
import { FiMinusSquare } from "react-icons/fi";
import { GiShoppingBag } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { CartContext } from "./../context/CartState";
export default function Navbar() {
  const { cart,Total, clearCart, removeFromCart, addToCart } =
    useContext(CartContext);
 
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
    <div className="fixed z-50 w-full flex items-start md:flex-row sm:flex-col  flex-col md:justify-between md:items-center bg-[#FC6A03] bg-gradient-to-r from-pink-500 to-yellow-500 ">
      <div className="logo ml-2">
        <Image src="/assets/logo.png" alt="logo" width={120} height={45} />
      </div>
      <div>
        <ul className="flex color text-white flex-col md:gap-8 gap-2 md:flex-row mt-4 md:mt-0 font-bold text-xl">
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
        onClick={toggleCart}
        className=" cursor-pointer md:relative  absolute right-4 mt-1 "
      >
        <BsCart4 className="md:text-2xl text-6xl text-white" />
      </div>
      <div
        ref={ref}
        className="  h-auto  sidebar w-72 absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-yellow-500 p-10 transform transition-transform translate-x-full"
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
                  <div className="w-2/3 font-semibold">{cart[key].name}</div>
                  <div className="flex w-1/3 font-semibold items-center justify-center">
                    <FiMinusSquare
                      className="text-xl"
                      onClick={() => {
                        removeFromCart(key, 1);
                      }}
                    />

                    <span className="m-2">{cart[key].qty}</span>

                    <FiPlusSquare
                      className="text-xl"
                      onClick={() => {
                        addToCart(key, 1);
                      }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        {Object.keys(cart).length>0 && <div>Total : {Total}</div>}
        <div className="flex text-center">
         <Link href="/checkout"><button className="bg-gray-300 mr-2 hover:bg-gray-400 text-gray-800 font-bold  px-1 rounded inline-flex items-center">
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
  );
}
