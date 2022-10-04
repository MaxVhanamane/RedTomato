import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiPlusSquare } from "react-icons/fi";
import { FiMinusSquare } from "react-icons/fi";
import { CartContext } from "./../context/CartState";
import { useRouter } from 'next/router';
import {  toast } from 'react-toastify';

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

    // If there are no items in the cart then we will not allow user to visit checkout page. we will redirect him to home page.
    if (Object.keys(JSON.parse(localStorage.getItem("cart"))).length == 0) {
      router.push("/")
    }
  
    if(pin){
    if (pin.length < 6 || address.length<1 || phone.length<10 || state.length<1 || city.length<1) {
      setLoading(true)
    }
    else if (pin.length == 6 && address.length>0 && phone.length>0) {
      setLoading(false)
    }
  }
  
  }, [pin,address,phone,state,city,cart])

  useEffect(()=>{
    let myUser= localStorage.getItem("user")
    let token= localStorage.getItem("token")
   
     if(myUser && token){
       setEmail(myUser)
       fetchUserDetails(token)
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


  const fetchUserDetails=async(tokenVal)=>{
    const data = {tokenVal };
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuserdetails`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
        // const result = await fetch('http://localhost:3000/api/createorder', {
        //   total: 55 + '00',
        // });

        // amount(here i.e total) :"integer" The amount for which the order was created, in currency subunits. 
        //For example, for an amount of ₹295, enter 29500. that is why added "00" in the end. (according to razor pay docs)
        const data = { total: Total + "00", oid,name, email, pin, phone, address,area,state,city, cart };
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/createorder`, {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        const response = await res.json()
        // while destructuring an object if you want to rename the key you can use this syntax "id: order_id" . now you can use order_id to access id's value.

        // checking if the user has tempered with the cart or not if he has tempered with it then we will get response.success===false.
        if (response.success === true) {


          const { amount, id: order_id, currency } = response.order;


          // const {
          //   data: { key: razorpayKey },
          // } = await fetch('http://localhost:3000/api/getrazorpaykey');

          // getting rezorpay key
          const resKey = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getrazorpaykey`)
          const razorpayKey = await resKey.json()

          const options = {
            key: razorpayKey,
            amount: amount,
            currency: currency,
            name: 'Red Tomato',
            description: order_id,
            order_id: order_id,
            // handler will run once the payment is done successfully.
            handler: async function (response) {

              // as razor pay takes money in paise for convenience we will convert it into rupees to store it in db  by using  (amount/100). 
              const data = {
                amount: (amount / 100),
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                orderid: order_id
              }

              const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`, {
                method: 'POST', // or 'PUT'
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              })

              const finalResponse = await res.json()
              // console.log({
              //   amount: amount,
              //   razorpayPaymentId: response.razorpay_payment_id,
              //   razorpayOrderId: response.razorpay_order_id,
              //   razorpaySignature: response.razorpay_signature,

              // })

              // redirecting user to order page after successful payment and signature verification.
              if (finalResponse.success) {
                // showing toast message after successful payment verification.
                toast.success(finalResponse.message, {
                
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "colored",
                  progress: undefined,
                });
                // redirecting to the order page with order id.
                router.push(`${process.env.NEXT_PUBLIC_HOST}/order?id=${order_id}`)
              }
              else {
                // showing toast message if signature verification fails.
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
            // prefill will show all the initial data when user clicks on pay. it's like a placeholder.
            prefill: {
              name: `${name}`,
              email: `${email}`,
              contact: `${phone}`,
            },
            notes: {
              address: { address },
            },
            // theme is to control your razorpay color
            theme: {
              color: 'green',
            },

          };

          // when script loads we will set loading as false this will enable the pay button.
          setLoading(false);
          // following code is to open razorpay gui.
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
          // adding if statement to make sure pay button is enabled even if user closes the payment window without paying.
          // if I don't add this if statement then if user closes payment window without paying that will disable the pay button.
          // if(paymentObject.open()){
          //   setLoading(false)
          // }
        }
        else {
          if(response.cartTempered){
            clearCart()
          }

          toast.error(response.error, {
      
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // To keep pay button enabled if the phone number is not 10 digit number. else it will disable pay button after getting response from the 
          // server.
          setLoading(false)
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
    <div className="flex flex-col md:flex-row container pt-20 justify-center m-auto mb-44 sm:mb-20">
      <div className="md:w-1/2 w-3/4 md:ml-20 m-auto mt-10  ">
        <h2 className="font-bold ml-4">1. Delivery Details</h2>
        <div className=" mt-6 ">


          <label htmlFor="name" className="block ml-4 mt-4">Name</label>
          <input type="text" name="name" onChange={handleChange} value={name} className="block md:w-9/12 w-full ml-4 mr-8 mt-2
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
          <label htmlFor="mail" className="block ml-4 mt-4">Email address</label>
          <input type="mail" name="email" onChange={handleChange} value={email} className="block md:w-9/12 w-full ml-4 mr-8 mt-2
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
          <label htmlFor="phone" className="block ml-4 mt-4">* Phone</label>
          <input maxLength={10} type="text" name="phone" onChange={handleChange} value={phone} placeholder="Enter your 10 digit phone number" required className="block md:w-9/12 w-full ml-4 mr-8 mt-2
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

          <label htmlFor="address" className="block ml-4 mt-4">* Address</label>
          <textarea type="text" name="address" onChange={handleChange} value={address} className="block md:w-9/12 w-full ml-4 mr-8 mt-2
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

          <label htmlFor="pin" className="block ml-4 mt-4">* Pin</label>
          <input maxLength={6} type="text" name="pin" onChange={handleChange} value={pin} placeholder="Enter your 6 digit pincode" required className="block md:w-9/12 w-full ml-4 mr-8 mt-2
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
         <label htmlFor="area" className="block ml-4 mt-4">Area, Street, Sector</label>
          <input type="text" name="area" onChange={handleChange} value={area} className="block md:w-9/12 w-full ml-4 mr-8 mt-2
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
          <label htmlFor="city" className="block ml-4 mt-4">Town/City</label>
          <input type="text" name="city" onChange={handleChange} value={city} className="block md:w-9/12 w-full ml-4 mr-8 mt-2
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
          <label htmlFor="state" className="block ml-4 mt-4">State</label>
          <input type="text" name="state" onChange={handleChange} value={state} className="block md:w-9/12 w-full ml-4 mr-8 mt-2
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
        <h2 className="font-bold ml-4">2. Order summary</h2>

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
                          removeFromCart(cart[key].slug, 1, cart[key].price, key, cart[key].size, cart[key].type);
                        }}
                      />

                      <span className="m-2">{cart[key].qty}</span>

                      <FiPlusSquare
                        className="text-xl text-gray-800"
                        onClick={() => {
                          addToCart(cart[key].slug, 1, cart[key].price, key, cart[key].size, cart[key].type);
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
            <Link href="/checkout"><button disabled={loading} onClick={loadRazorpay} className="disabled:bg-gray-400 enabled:bg-blue-500 mt-6 enabled:hover:bg-blue-600 text-gray-100 font-bold  px-4 py-1 rounded inline-flex items-center">

              {Object.keys(cart).length > 0 && <span> Pay ₹{Total} </span>}
            </button></Link>

          </div>

        </div>
          <p className="text-gray-500 text-center mt-2" >* Fill in the delivery details to enable the pay button.</p>


      </div>
    </div>


  )
}

