import React, { useContext} from "react";

import { CartContext } from "./../../context/CartState";
import dynamic from "next/dynamic";
import 'react-loading-skeleton/dist/skeleton.css'
import CartDataSkeleton from "./CartDataSkeleton"
const CartData=dynamic(()=>import("./CartData")
,{
    loading:()=><div ><CartDataSkeleton /></div>,
    ssr:true
}
)


const Cart=()=>{
    const {
        ref,
        importCartDynamically
      } = useContext(CartContext);
    return (<>
     <div
          ref={ref}
          
          className=" h-screen overflow-y-scroll  shadow-md rounded-sm w-full sidebar md:w-fit absolute top-0 right-0 bg-gray-100  p-10 transform transition-transform translate-x-full duration-300 pb-32"
        >
            <h2 className="font-bold lg:text-xl  text-center text-base  text-gray-900 ">My cart</h2>
            {/* Separating the cartData because If I don't do this and If I dynamically Import the Cart then When I click on Cart button
            the cart button will try to toggle the cart but as I am importing it dynamically I will not have access to the ref so it will throw an error. */}
         {importCartDynamically?<CartData/> :null}
        </div>

    </>)
}

export default Cart
