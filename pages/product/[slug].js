import React, { useState, useContext,useEffect } from "react";
// To handle different states
import { CartContext } from "./../../context/CartState";
// To redirect user
import { useRouter } from "next/router";
// Food modal
import Food from './../../models/foods';
// To connect it to database
import connectDb from './../../middleware/mongoose';
// To show custom error page.
import Error from "next/error"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";
import Image from "next/image"

export default function Product({ foodItem, error }) {
 
  //  to control the radio buttons 
  const [selectedRadioBtn, setSelectedRadioBtn] = useState("small")
  const [foodPrice, setFoodPrice] = useState(foodItem?foodItem[0].price[0]:"")
  const { orderNow, addToCart, toggleCart, cartChange,setCartChange } = useContext(CartContext);
  const [inputPin, setInputPin] = useState();
  const [pin, setPin] = useState();
  const [goToCart, setGoToCart] = useState(false)
  
  const router = useRouter();
  const { slug } = router.query;
  const handleInputPin = (e) => {
    setInputPin(e.target.value);
  };
  const handlePinCheck = async () => {
    const allPins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/checkpin`);
    const pins = await allPins.json();

    if (Object.keys(pins[0]).includes(inputPin)) {
      setPin(true);
    } else {
      setPin(false);
    }
  };

 

  useEffect(()=>{
  let cartItems=JSON.parse(localStorage.getItem("cart"))
  // console.log(cartItems)
 if(cartItems){

  let arr=Object.keys(cartItems)
  
  if(arr.length===0){
   
    setGoToCart(false)
  }

  let sizes=["small","medium","large"]
 
  Object.keys(cartItems)&& Object.keys(cartItems).some((item)=>{
    
    if(foodItem[0].slug===cartItems[item].slug ){

    if(sizes.includes(cartItems[item].size) && cartItems[item].size===selectedRadioBtn){
      setGoToCart(true)
    
      return true
      
    }
  
    else{
      setGoToCart(false)
    }
      
    }
    else{
      setGoToCart(false)
      
    }
   
   })


 }
},[selectedRadioBtn,goToCart,cartChange])
  const handleSizeChange = (e) => {
    setSelectedRadioBtn(e.target.value)
    if (e.target.value === "small") {
      // to show add to cart button when user selects small medium or large button we will add setGoToCart(false)
      setFoodPrice(foodItem[0].price[0])
    }
    else if (e.target.value === "medium") {
      
      setFoodPrice(foodItem[0].price[1])
    }
    else if (e.target.value === "large") {
      
      setFoodPrice(foodItem[0].price[2])
    }
    
  }

  const isRadioSelected = (value) => {
    return selectedRadioBtn === value;
  }


  return (
    <>
    <Head>
    <title>{foodItem?foodItem[0].title:"Red Tomato"}</title>
    <meta name="description" content={foodItem?foodItem[0].title:"Red Tomato"} />
   </Head>
    {!error ?<section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        {foodItem.map((item) => {
          return <div key={item._id} className="lg:w-4/5 my-auto mx-auto flex flex-wrap">
             <div  className="prod_img lg:w-1/2 w-full " >
            <Image
              alt={item.title}
              layout="fill"
              src={item.img}
             
              className="rounded-xl"
              objectFit="cover"
            />
            </div>
          
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Red Tomato
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {item.title}
              </h1>
              {/* <div className="flex mb-4">
                <span className="flex items-center">
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-orange-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-orange-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-orange-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-orange-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-orange-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <span className="text-gray-600 ml-3">4 Reviews</span>
                </span>
                <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                  <a className="text-gray-500">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                    </svg>
                  </a>
                  <a className="text-gray-500">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                    </svg>
                  </a>
                  <a className="text-gray-500">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                    </svg>
                  </a>
                </span>
              </div> */}
              <p className="leading-relaxed">
                {item.desc}
              </p>
              <div className="flex mt-6  pb-5 border-b-2 border-gray-100 mb-5">
                {/* <div className="flex justify-center w-1/2">
                <div className="flex justify-center items-center">
                
                </div>
              </div> */}
                <div className="flex justify-center ">
                  <div>Sizes:</div>
                  <div className="flex justify-center items-center">

                    <div className="flex  ml-12 ">
                      <form action="" className="flex ">
                        <div className="flex ml-3 ">
                          <div><input onChange={handleSizeChange} type="radio" id="small" name="foodSize" value="small" checked={isRadioSelected("small")} /></div>
                          <div> <label className="ml-2" htmlFor="small">Small</label></div>
                        </div>
                        <div className="flex ml-3 ">
                          <div><input onChange={handleSizeChange} type="radio" id="medium" name="foodSize" value="medium" checked={isRadioSelected("medium")} /></div>
                          <div><label className="ml-2" htmlFor="medium">Medium</label></div> </div>

                        <div className="flex ml-3 ">
                          <div><input onChange={handleSizeChange} type="radio" id="large" name="foodSize" value="large" checked={isRadioSelected("large")} /></div>
                          <div><label className="ml-2" htmlFor="large">Large</label>
                          </div>
                        </div>

                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-5">{item.availableQty == 0 && <p className="text-red-600">Sorry! Currently this food is not deliverable.</p>}</div>
              <div className="flex items-center">
                <div className="basis-16 text-center title-font font-medium text-xl text-gray-900 w-auto" >
                  {/* // adding a function which will decide the price accoding to size of the food */}
                  {
                    (() => {
                      if (selectedRadioBtn === "small")
                        return <>₹{item.price[0]}</>
                      else if (selectedRadioBtn === "medium")
                        return <>₹{item.price[1]}</>
                      else if (selectedRadioBtn === "large")
                        return <>₹{item.price[2]}</>

                    })()
                  }
                </div>


                <div >
                  {/* if availableQty is zero then we will not allow user to add item to the cart.  */}
                  <>
    {(() => {
   
 
    })()}
  </>
                  {!goToCart ? <button disabled={item.availableQty == 0}
                    onClick={() => {
                      addToCart(slug, 1, foodPrice, `${item.title} (${selectedRadioBtn})`, `${selectedRadioBtn}`, `${item.category}`);
                      toast.success('Item added to cart.', {
                        
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                      setGoToCart(true)
                    }}
                    className=" disabled:bg-gray-400 flex lg:ml-5 ml-3  text-white bg-[#ff2400] border-0 py-2 lg:px-6 px-2 focus:outline-none hover:bg-[#FF0000] rounded-lg"
                  >
                    Add to Cart
                  </button> :

                    <button disabled={item.availableQty == 0}
                      onClick={() => {
                        toggleCart()
                      }}
                      className=" disabled:bg-gray-400 flex lg:ml-5 ml-3 text-white bg-[#ff2400] border-0 py-2 lg:px-6 px-2 focus:outline-none hover:bg-[#FF0000] rounded-lg"
                    >
                      Go to Cart
                    </button>

                  }


                </div>
                <div >
                  <button disabled={item.availableQty == 0} onClick={() => { orderNow(slug, 1, foodPrice, `${item.title} (${selectedRadioBtn})`, `${item.size}`, `${item.category}`) }} className="flexdisabled:bg-gray-400 ml-8 text-white bg-[#ff2400] border-0 py-2 px-6 focus:outline-none hover:bg-[#FF0000] rounded-lg">
                    Order Now
                  </button></div>

              </div>

              <div className=" flex justify-start items-center mt-8">
                <div className="  relative ">
                  <input
                    onChange={handleInputPin}
                    type="text"
                    className="  h-14 w-full lg:w-11/12 pl-10 pr-32 rounded-lg z-0  border-2 border-gray-600 focus:shadow focus:outline-none"
                    placeholder="
            Enter your pincode"
                    maxLength={6}
                  />
                  <div className="absolute top-2 lg:right-10 right-4 ">
                    <button
                      onClick={handlePinCheck}
                      className="h-10 w-20 text-white rounded-lg bg-[#ff2400] hover:bg-[#FF0000]"
                    >
                      Check
                    </button>{" "}
                  </div>
                </div>
              </div>
              <div className="pinCodeMessage my-4">
                {!pin && pin != null && (
                  <span className="text-red-600">
                    Sorry! Delivery to the above pincode is currently unavailable.
                  </span>
                )}
                {pin && pin != null && (
                  <span className="text-green-500">Delivery is available.</span>
                )}
              </div>
            </div>
          </div>
        })}
      </div>
    </section>: <Error statusCode={error} /> }
    </>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  // Fetch data from external API
  connectDb()
  let error;
  let food = await Food.find({ slug: context.query.slug })

  if (food.length == 0) {
    return { props: { error: 404 } }
  }
  // Pass data to the page via props
  return { props: { foodItem: JSON.parse(JSON.stringify(food)) } }
}
