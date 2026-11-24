import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiPlusSquare } from "react-icons/fi";
import { FiMinusSquare } from "react-icons/fi";
import { CartContext } from "./../context/CartState";
import { useRouter } from 'next/router';
import {  toast } from 'react-toastify';
import Head from "next/head";


export default function Checkout() {

  const { cart, Total, clearCart, removeFromCart, addToCart } =
    useContext(CartContext);
  // loading state is for razorpay.
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  // handeling form input
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [area, setArea] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [pin, setPin] = useState("")

  useEffect(() => {
    // If there are no items in the cart then we redirect to home page safely.
    try {
      const stored = localStorage.getItem("cart");
      const parsed = stored ? JSON.parse(stored) : {};
      if (Object.keys(parsed).length === 0) {
        router.push("/");
      }
    } catch (e) {
      router.push("/");
    }
  
    if (pin) {
      if (pin.length < 6 || address.length < 1 || phone.length < 10 || state.length < 1 || city.length < 1) {
        setLoading(true);
      } else if (pin.length === 6 && address.length > 0 && phone.length === 10) {
        setLoading(false);
      }
    }
  }, [pin, address, phone, state, city, cart]);

  useEffect(()=>{
    let myUser = localStorage.getItem("user");
    if(myUser){
      setEmail(myUser);
      fetchUserDetails();
    }
  },[])


  const handleChange = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value)
    }
    else if (e.target.name === "email") {
      setEmail(e.target.value)
    }
    else if (e.target.name === "phone") {
      setPhone(e.target.value)
    }
    else if (e.target.name === "address") {
      setAddress(e.target.value)
    }
    else if (e.target.name === "pin") {
      setPin(e.target.value)


    }
    else if (e.target.name === "state") {
      setState(e.target.value)


    }
    else if (e.target.name === "city") {
      setCity(e.target.value)


    }
    else if (e.target.name === "area") {
      setArea(e.target.value)


    }

    if (name.length > 0 && email.length > 0 && phone.length > 1 && address.length > 0 && pin.length > 4 && state.length>0  && city.length>0 ) {
      setLoading(false)
    }


  }


  const fetchUserDetails=async()=>{
    const res = await fetch('/api/getuserdetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const response = await res.json()
 
    if(response.success)
    {
    setName(response.name)
    setAddress(response.address)
    setPin(response.pin)
    setCity(response.city)
    setState(response.state)
    setArea(response.area)
    setPhone(response.phone)
    }
   
  }

  // RazorPay
  function loadRazorpay() {
    // generating an order id.
    let oid = Math.floor(Math.random() * Date.now()).toString()
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
        const data = { name, email, pin, phone, address, area, state, city, cart };
        const res = await fetch('/api/createorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const response = await res.json();

        if (response.success === true) {
          const { amount, id: order_id, currency } = response.order;

          // get razorpay key
          const resKey = await fetch('/api/getrazorpaykey');
          const keyData = await resKey.json();
          const razorpayKey = keyData?.key || keyData;

          const options = {
            key: razorpayKey,
            amount: amount,
            currency: currency,
            name: 'Red Tomato',
            description: `Order ${order_id}`,
            order_id: order_id,
            "method": {
              "netbanking": "1",
              "card": "1",
              "upi": "1",
              "wallet": "1",
            },
            handler: async function (response) {
              const data = {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              };

              const res = await fetch('/api/posttransaction', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });

              const finalResponse = await res.json();

              if (finalResponse.success) {
                clearCart(true); // Clear cart on payment success
                toast.success(finalResponse.message, {
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "colored",
                });
                router.push(`/order?id=${order_id}`);
              } else {
                toast.error(finalResponse.message, {
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }
            },
            prefill: {
              name: `${name}`,
              email: `${email}`,
              contact: `${phone}`,
            },
            notes: {
              address: address,
            },
            theme: {
              color: "#e53e3e",
            },
          };

          setLoading(false);
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        } else {
          if (response.cartTempered) {
            clearCart(true);
          }

          toast.error(response.error, {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setLoading(false);
        }
      } catch (err) {
        // alert(err);
        console.log(err)
        // setLoading(false);
      }
    };
    document.body.appendChild(script);
  }




  return (
    <>
    <Head>
    <title>Checkout</title>
    <meta name="description" content="Red Tomatos Checkout page"/>
   </Head>
    <div className="flex flex-col md:flex-row container pt-20 justify-center m-auto mb-44 sm:mb-20">
      <div className="md:w-1/2 w-3/4 md:ml-20 m-auto mt-10  ">
        <h2 className="font-bold ">1. Delivery Details</h2>
        <div className=" mt-6 ">


          <label htmlFor="name" className="block  mt-4">Name</label>
          <input type="text" name="name" onChange={handleChange} value={name} className="block md:w-9/12 w-full  mr-8 mt-2
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
          <label htmlFor="mail" className="block  mt-4">Email address</label>
          <input type="mail" name="email" onChange={handleChange} value={email} className="block md:w-9/12 w-full  mr-8 mt-2
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
          <label htmlFor="phone" className="block  mt-4">* Phone</label>
          <input maxLength={10} type="text" name="phone" onChange={handleChange} value={phone} placeholder="Enter your 10 digit phone number" required className="block md:w-9/12 w-full  mr-8 mt-2
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

          <label htmlFor="address" className="block  mt-4">* Address</label>
          <textarea type="text" name="address" onChange={handleChange} value={address} className="block md:w-9/12 w-full  mr-8 mt-2
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
       resize-none
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />

          <label htmlFor="pin" className="block  mt-4">* Pin</label>
          <input maxLength={6} type="text" name="pin" onChange={handleChange} value={pin} placeholder="Enter your 6 digit pincode" required className="block md:w-9/12 w-full  mr-8 mt-2
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
         <label htmlFor="area" className="block  mt-4">Area, Street, Sector</label>
          <input type="text" name="area" onChange={handleChange} value={area} className="block md:w-9/12 w-full  mr-8 mt-2
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
          <label htmlFor="city" className="block  mt-4">Town/City</label>
          <input type="text" name="city" onChange={handleChange} value={city} className="block md:w-9/12 w-full  mr-8 mt-2
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
          <label htmlFor="state" className="block  mt-4">State</label>
          <input type="text" name="state" onChange={handleChange} value={state} className="block md:w-9/12 w-full  mr-8 mt-2
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
      <div className="md:w-1/2 w-3/4 md:ml-10 m-auto mt-10 mb-10 ">
        {/*  Order summary */}
        <h2 className="font-bold lg:ml-4">2. Order summary</h2>

        <div
          className=" mt-6 m-auto h-auto sidebar md:w-72 w-72  bg-gray-100 p-10 "
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
                    <div className="w-2/3 font-semibold text-gray-800">{key}</div>
                    <div className="flex w-1/3 font-semibold items-center justify-center">
                      <FiMinusSquare
                        className="text-xl text-gray-800"
                        onClick={() => {
                          removeFromCart(cart[key].slug, 1, cart[key].price, key, cart[key].size, cart[key].type,cart[key].img);
                        }}
                      />

                      <span className="m-2">{cart[key].qty}</span>

                      <FiPlusSquare
                        className="text-xl text-gray-800"
                        onClick={() => {
                          addToCart(cart[key].slug, 1, cart[key].price, key, cart[key].size, cart[key].type,cart[key].img);
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          {Object.keys(cart).length > 0 && <div>Grand total : ₹{Total}</div>}
          <div className=" text-center">
            <button
              type="button"
              disabled={loading}
              onClick={loadRazorpay}
              className="outline-none disabled:bg-gray-400 enabled:bg-blue-600 mt-6 enabled:hover:bg-blue-700 text-gray-100 font-bold px-6 py-2 rounded inline-flex items-center shadow transition"
            >
              {Object.keys(cart).length > 0 && <span> Pay ₹{Total} </span>}
            </button>
          </div>

        </div>
          <p className="text-gray-500 text-center mt-2" >* Fill in the delivery details to enable the pay button.</p>


      </div>
    </div>
</>

  )
}

