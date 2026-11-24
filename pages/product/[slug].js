import React, { useState, useContext, useEffect } from "react";
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
import Image from "next/image";
import { getFoodImage, handleImageError } from '../../utils/imageHelper';

const Product = ({ foodItem, error }) => {

  //  to control the radio buttons 
  const [selectedRadioBtn, setSelectedRadioBtn] = useState("small")
  const [foodPrice, setFoodPrice] = useState(foodItem ? foodItem[0].price[0] : "")
  const { orderNow, addToCart, toggleCart, cartChange, setCartChange, setImportCartDynamically } = useContext(CartContext);
  const [inputPin, setInputPin] = useState("");
  const [pin, setPin] = useState(null);
  const [goToCart, setGoToCart] = useState(false)
  const [checkPinBtnClicked, setCheckPinBtnClicked] = useState(false)

  const router = useRouter();
  const { slug } = router.query;
  const handleInputPin = (e) => {
    setInputPin(e.target.value);
    setCheckPinBtnClicked(false)
  };
  const handlePinCheck = async () => {
    const allPins = await fetch('/api/checkpin');
    const pins = await allPins.json();

    if (Object.keys(pins[0]).includes(inputPin)) {
      setPin(true);
    } else {
      setPin(false);
    }
    setCheckPinBtnClicked(true)
  };



  useEffect(() => {
    let cartItems = JSON.parse(localStorage.getItem("cart"))
    // console.log(cartItems)
    if (cartItems) {

      let arr = Object.keys(cartItems)

      if (arr.length === 0) {

        setGoToCart(false)
      }

      let sizes = ["small", "medium", "large"]

      Object.keys(cartItems) && Object.keys(cartItems).some((item) => {

        if (foodItem[0].slug === cartItems[item].slug) {

          if (sizes.includes(cartItems[item].size) && cartItems[item].size === selectedRadioBtn) {
            setGoToCart(true)

            return true

          }

          else {
            setGoToCart(false)
          }

        }
        else {
          setGoToCart(false)

        }

      })


    }
  }, [selectedRadioBtn, goToCart, cartChange])
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
        <title>{foodItem ? foodItem[0].title : "Red Tomato"}</title>
        <meta name="description" content={foodItem ? foodItem[0].title : "Red Tomato"} />
      </Head>
      {!error ? <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          {foodItem.map((item) => {
            return <div key={item._id} className="lg:w-4/5 my-auto mx-auto flex flex-wrap">
              <div className="prod_img lg:w-1/2 w-full " >
                <Image
                  alt={item.title || "Food item"}
                  layout="fill"
                  src={getFoodImage(item.img, item.category === "veg" ? "/assets/veg.png" : "/assets/nonveg.png")}
                  className="rounded-xl"
                  objectFit="cover"
                  onError={(e) => handleImageError(e, item.category === "veg" ? "/assets/veg.png" : "/assets/nonveg.png")}
                />
              </div>

              <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                  Red Tomato
                </h2>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                  {item.title}
                </h1>

                <p className="leading-relaxed">
                  {item.desc}
                </p>
                <div className="flex mt-6  pb-5 border-b-2 border-gray-100 mb-5">

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

                    {!goToCart ? <button disabled={item.availableQty == 0}
                      onClick={() => {
                        addToCart(slug, 1, foodPrice, `${item.title} (${selectedRadioBtn})`, `${selectedRadioBtn}`, `${item.category}`, getFoodImage(item.img));
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
                      className=" disabled:bg-gray-400 flex lg:ml-5 ml-3  text-white bg-[#FF0000] border-0 py-2   focus:outline-none hover:bg-[#ff2400] rounded-lg w-28  items-center justify-center"
                    >

                      Add to Cart
                    </button> :

                      <button disabled={item.availableQty == 0}
                        onClick={() => {
                          setImportCartDynamically(true)
                          toggleCart()

                        }}
                        className=" disabled:bg-gray-400 flex lg:ml-5 ml-3 text-white bg-[#FF0000] border-0 py-2   focus:outline-none hover:bg-[#ff2400] rounded-lg w-28  items-center justify-center"
                      >
                        Go to Cart
                      </button>

                    }


                  </div>
                  <div>
                    <button disabled={item.availableQty == 0} onClick={() => { orderNow(slug, 1, foodPrice, `${item.title} (${selectedRadioBtn})`, `${selectedRadioBtn}`, `${item.category}`, getFoodImage(item.img)) }} className="flex disabled:bg-gray-400 ml-8 text-white bg-[#FF0000] border-0 py-2 px-4 focus:outline-none hover:bg-[#ff2400] rounded-lg ">
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
                        className="h-10 w-20 text-white rounded-lg bg-[#FF0000] hover:bg-[#ff2400]"
                      >
                        Check
                      </button>{" "}
                    </div>
                  </div>
                </div>
                <div className="pinCodeMessage my-4">
                  {inputPin.length > 5 && !pin && pin != null && checkPinBtnClicked && (
                    <span className="text-red-600">
                      Sorry! Delivery to the above pincode is currently unavailable.
                    </span>
                  )}
                  {inputPin.length > 5 && pin && pin != null && checkPinBtnClicked && (
                    <span className="text-green-500">Delivery is available.</span>
                  )}
                  {inputPin.length < 6 && pin != null && checkPinBtnClicked && (
                    <span className="text-red-600">Enter a 6 digit PIN code.</span>
                  )}
                </div>
              </div>
            </div>
          })}
        </div>
      </section> : <Error statusCode={error} />}
    </>
  );
}

export default Product

// This gets called on every request
export async function getServerSideProps(context) {
  await connectDb();
  const food = await Food.find({ slug: context.query.slug }).lean();

  if (!food || food.length === 0) {
    return { props: { error: 404 } };
  }
  const sanitizedFood = food.map((f) => ({
    ...f,
    img: getFoodImage(f.img, f.category === 'veg' ? '/assets/veg.png' : '/assets/nonveg.png'),
  }));
  return { props: { foodItem: JSON.parse(JSON.stringify(sanitizedFood)) } };
}
