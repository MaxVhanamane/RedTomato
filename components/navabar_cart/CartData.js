import { FiPlusSquare } from "react-icons/fi";
import { FiMinusSquare } from "react-icons/fi";
import { GiShoppingBag } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";
import Image from "next/image"
import Link from "next/link"
import { CartContext } from "./../../context/CartState";
import React, { useContext,useRef,memo} from "react";
import styles from "../../styles/Navigation.module.css"
const CartData=()=>{
    const {
        cart,
        Total,
        clearCart,
        removeFromCart,
        addToCart,
        toggleCart,
      } = useContext(CartContext);
    return (<>
        
        
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
                    
                  <span className={`absolute -right-1 -top-1 rounded-full leading-5 bg-red-600 w-5 h-5  ${cart[key].qty>99 && "w-7 rounded-md"} text-white font-mono text-xs align-middle  text-center z-[20]`}>{cart[key].qty<100 ?<span>{cart[key].qty}</span>:<span className="text-[0.8rem]">99+</span>}</span>
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

                      <span className={`m-2 w-3 flex justify-center`}>{cart[key].qty}</span>
                     
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
        
        </>)
}

export default CartData
