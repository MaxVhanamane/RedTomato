import React, { useContext } from "react";
import Link from "next/link";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiPlusSquare } from "react-icons/fi";
import { FiMinusSquare } from "react-icons/fi";
import { GiShoppingBag } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { CartContext } from "./../context/CartState";
export default function Checkout() {
  const { cart,Total, clearCart, removeFromCart, addToCart } =
  useContext(CartContext);
  return (
    <div className="flex container pt-20 ">
     <div className="w-1/2 ml-20  ">
     <h2 className="font-bold ml-4">Contact Information</h2>
     <div className="mt-2">

    
    <label htmlFor="name" className="ml-4 mt-6">Name</label>
    <input type="text" className="block w-9/12 ml-4 mr-8 mt-2
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
    <label htmlFor="mail" className="ml-4 mt-6">Email address</label>
    <input type="mail" className="block w-9/12 ml-4 mr-8 mt-2
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
    <label htmlFor="address" className="ml-4 mt-6">Address</label>
    <textarea type="text" className="block w-9/12 ml-4 mr-8 mt-2
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
      </div> 
      
      </div>
      <div className="w-1/2 ml-20  ">

      {/*  Order summary */}
     <h2 className="font-bold ml-4">Order summary</h2>
     
     <div
        className=" mt-6 h-auto sidebar w-9/12  bg-gray-100 p-10 "
      >
  
        <span
          className="absolute top-3 right-2 cursor-pointer text-xl"
        >
          <AiFillCloseCircle />
        </span>
        {Object.keys(cart).length == 0 && (
          <p className="text-center">No order Found!</p>
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
        {Object.keys(cart).length>0 && <div>Grand total : ₹{Total}</div>}
        <div className=" text-center">
         <Link href="/checkout"><button className="bg-gray-400 mt-6 hover:bg-gray-400 text-gray-800 font-bold  px-4 py-1 rounded inline-flex items-center">
            
            {Object.keys(cart).length>0 && <span> Pay ₹{Total} </span>}
          </button></Link>
        
        </div>
      </div>
     
     
      </div>
    </div>

  
  )
}

