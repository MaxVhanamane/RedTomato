import React from 'react'
import connectDb from './../middleware/mongoose';
import Order from './../models/orders';
import Image from "next/image"
export default function MyOrder({ order }) {
  const products = order.products

  return (
    <section className="text-gray-600 body-font overflow-hidden ">
      <h1 className='text-center font-bold text-2xl  text-gray-700 lg:pt-24 lg:mb-12 pt-20 mb-2 '>My Orders</h1> 
      <div className="flex justify-center items-center px-5  mx-auto flex-col gap-8">
      {Object.keys(products).map((item) => {
        return <div key={item} className="lg:w-4/5 mx-5 mt-5 flex flex-wrap items-center justify-center ">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">Red Tomato</h2>
            <h3 className="text-gray-700 md:text-2xl text-md lg:text-xl title-font font-medium mb-2 mt-2">Order Id : # {order.orderId}</h3>
            <p className="leading-relaxed mb-1">Your order has been placed successfully.</p>
            <p className="leading-relaxed mb-4">Payment status : <span className='font-bold'> {order.status}</span></p>
            <div className="flex mb-4">
              <a className="flex-grow text-center  border-b-2 border-gray-300 py-2 text-lg ">Food Name</a>
              <a className="flex-grow text-center border-b-2 border-gray-300 py-2 text-lg  ">Quantity</a>
              <a className="flex-grow text-center border-b-2 border-gray-300 py-2 text-lg">Price</a>
            </div>

           
               <div  className="flex  border-gray-200 py-2">
                <span className="m-auto text-gray-500">{item}</span>
                <span className="m-auto text-gray-500">{products[item].qty}</span>
                <span className="m-auto text-gray-500">{products[item].price}</span>
              </div>
          

         
          </div>
          {/* <img alt="ecommerce" className="lg:w-1/2 w-full  mt-5 lg:h-[22rem] h-80 object-cover object-center rounded" src={order.img} /> */}
          <Image src={products[item].img} alt="Food image" width={400} height={400} className="rounded-md"/>
          
        </div>


})}

              {/* <button className="flex mr-auto mt-4 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Track Order</button> */}
              {/* <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
              <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
              </svg>
            </button> */}

    
              
      </div >
      <div className=" lg:w-4/5 flex lg:justify-start lg:ml-[16.2rem] justify-center mb-4 lg:mb-8">
      <p className="title-font font-medium text-2xl text-gray-700 mt-10">Total amount paid: <span className="text-red-500">₹{order.amount}</span></p>
      </div>
    </section>
  )
}

// This gets called on every request
export async function getServerSideProps(context) {
  // Fetch data from external API
  connectDb()
  let order = await Order.find({orderId:context.query.id})


  return { props: { order: JSON.parse(JSON.stringify(order[0])) } }
}
