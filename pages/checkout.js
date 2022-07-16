import React, { useState,useContext } from "react";
import Link from "next/link";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiPlusSquare } from "react-icons/fi";
import { FiMinusSquare } from "react-icons/fi";
import { CartContext } from "./../context/CartState";
export default function Checkout() {

  const { cart,Total, clearCart, removeFromCart, addToCart } =
  useContext(CartContext);
 // loading state is for razorpay.
  const [loading, setLoading] = useState(false);
  

  function loadRazorpay() {
    console.log("func",Total)
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onerror = () => {
      alert('Razorpay SDK failed to load. Are you online?');
    };
    script.onload = async () => {
      try {
  // initially setting loading as true because when page loads sometimes razorpay script takes time to load that's why we want to keep 
  // pay button disabled.
        setLoading(true);
        // const result = await fetch('http://localhost:3000/api/createorder', {
        //   total: 55 + '00',
        // });

       // amount(here i.e total) :"integer" The amount for which the order was created, in currency subunits. 
       //For example, for an amount of ₹295, enter 29500. that is why added "00" in the end. (according to razor pay docs)
        const data = {  total: Total+"00" };  
      const res = await fetch('http://localhost:3000/api/createorder', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const response = await res.json()
// while destructuring an object if you want to rename the key you can use this syntax "id: order_id" . now you can use order_id to access id's value.
        const { amount, id: order_id, currency } = response;

         
        // const {
        //   data: { key: razorpayKey },
        // } = await fetch('http://localhost:3000/api/getrazorpaykey');
     
        // getting rezorpay key
        const resKey = await fetch('http://localhost:3000/api/getrazorpaykey')
        const razorpayKey=await resKey.json()

        const options = {
          key: razorpayKey,
          amount: amount,
          currency: currency,
          name: 'example name',
          description: 'example transaction',
          order_id: order_id,
          // handler will run once the payment is done successfully.
          handler: async function (response) {
            // const result = await fetch('/pay-order', {
            //   amount: amount,
            //   razorpayPaymentId: response.razorpay_payment_id,
            //   razorpayOrderId: response.razorpay_order_id,
            //   razorpaySignature: response.razorpay_signature,
            // });
            // alert(result.data.msg);
            // fetchOrders();
            alert("Payment Successfull!")
          },
          // prefill will show all the initial data when user clicks on pay. it's like a placeholder.
          prefill: {
            name: 'example name',
            email: 'example@gmail.com',
            contact: '111111',
          },
          notes: {
            address: 'example address',
          },
          // theme is to control your razorpay color
          theme: {
            color: 'Orange',
          },
        };
  
        // when script loads we will set loading as false this will enable the pay button.
        setLoading(false);
        // following code is to open razorpay gui.
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        // alert(err);
        console.log(err)
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  }





  return (
    <div className="flex container pt-20 ">
     <div className="w-1/2 ml-20   ">
     <h2 className="font-bold ml-4">Contact Information</h2>
     <div className=" mt-6 ">

    
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
         <label htmlFor="name" className="ml-4 mt-6">Phone</label>
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
         <label htmlFor="name" className="ml-4 mt-6">City</label>
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
         <label htmlFor="name" className="ml-4 mt-6">State</label>
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
         <label htmlFor="name" className="ml-4 mt-6">Pin</label>
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
                  <div className="w-2/3 font-semibold">{key}</div>
                  <div className="flex w-1/3 font-semibold items-center justify-center">
                    <FiMinusSquare
                      className="text-xl"
                      onClick={() => {
                        removeFromCart(cart[key].slug, 1,cart[key].price,key,cart[key].size,cart[key].type);
                      }}
                    />

                    <span className="m-2">{cart[key].qty}</span>

                    <FiPlusSquare
                      className="text-xl"
                      onClick={() => {
                        addToCart(cart[key].slug, 1,cart[key].price,key,cart[key].size,cart[key].type);
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
         <Link href="/checkout"><button disabled={loading} onClick={loadRazorpay} className="bg-gray-400 mt-6 hover:bg-gray-400 text-gray-800 font-bold  px-4 py-1 rounded inline-flex items-center">
            
            {Object.keys(cart).length>0 && <span> Pay ₹{Total} </span>}
          </button></Link>
        
        </div>
      </div>
     
     
      </div>
    </div>

  
  )
}

