import React from "react";
import Image from "next/image";
import connectDb from './../middleware/mongoose';
import Food from './../models/foods';
import Link from 'next/link';
export default function Veg({ foodItems }) {
  const myLoader = () => {
    return `https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60`;
  };
  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-16 mx-auto  ">
              <h1 className="font-bold text-2xl text-center mb-4 text-green-600 lg:mt-6 mt-10 underline">Veg food items</h1>
              
          <div className="flex flex-wrap m-auto  justify-center ">
            {foodItems.map((item) => {

              return <div key={item._id} className=" mt-3 mr-2 hover:shadow-xl hover:bg-gray-100 rounded-xl  antialiased">
              <Link passHref href={`/product/${item.slug}`}><a className="block relative p-3  rounded-xl overflow-hidden">
                <Image className="rounded-xl"
                  loader={myLoader}
                  alt="ecommerce"
                  src={item.img}
                  width={320}
                  height={250}
                />

<div className="mt-3">
                  {/* Types:
                  {item.type.map((foodtypes) => {
                    return <span key={foodtypes} className=" text-center text-gray-500 text-xs tracking-widest title-font mb-1 border px-1 border-gray-300 mx-1 "> {foodtypes}</span>
                  })}
                  <br />
                  Sizes:
                  {item.size.map((foodtsizes) => {
                    return <span key={foodtsizes} className="text-center text-gray-500 text-xs tracking-widest title-font mb-1  border  border-gray-300 mx-1 px-1"> {foodtsizes} </span>
                  })} */}


<h2 className=" text-gray-900 title-font text-lg font-medium">
                    {item.title}
                  </h2>
                  <p className="  text-gray-500 text-xs tracking-widest title-font mb-1 w-80   ">{ item.desc.slice(0,150)}...</p>
                  <hr className="block bg-gray-400 h-0.5"/>
                
                  <p className=" pb-2 mt-1">₹{item.price[0]}</p>
                </div> </a>
              </Link>
            </div>
            })}

          </div>
        </div>
      </section>
    </>
  );


}


// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  connectDb()
  let foods = await Food.find({category:"veg"})
 
  
  return { props: { foodItems:JSON.parse(JSON.stringify(foods)) } }
}

// to avoid Error serializing `.food[0]` returned from `getServerSideProps` in "/veg". error we are using
// JSON.parse(JSON.stringify(food))

// let veg = {}
// for (let item of foods) {
//   if (item.title in veg) {

//     if (!veg[item.title].size.includes(item.size) && item.availableQty > 0) {
//       veg[item.title].size.push(item.size)
//     }
//     if (!veg[item.title].type.includes(item.type) && item.availableQty > 0) {
//       veg[item.title].type.push(item.type)
//     }
//   }
//   else {
//     veg[item.title] = JSON.parse(JSON.stringify(item))
//     if (item.availableQty > 0) {
//       veg[item.title].type = [item.type]
//       veg[item.title].size = [item.size]
//     }
//   }
// }
