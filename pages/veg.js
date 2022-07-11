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
        <div className="container px-5 py-24 mx-auto  ">
          <div className="flex flex-wrap m-auto items-center justify-center ">

            {Object.keys(foodItems).map((item) => {

              return <div key={foodItems[item]._id} className=" p-3 mt-3 shadow-lg r">
                <Link passHref href={`/product/${foodItems[item].slug}`}><a className="block relative  rounded overflow-hidden">
                  <Image
                    loader={myLoader}
                    alt="ecommerce"
                    src={foodItems[item].img}
                    width={300}
                    height={280}
                  />

                  <div className="mt-4">
                    Types:
                    {foodItems[item].type.map((foodtypes) => {
                      return <span key={foodtypes} className=" text-center text-gray-500 text-xs tracking-widest title-font mb-1 border px-1 border-gray-300 mx-1 "> {foodtypes}</span>
                    })}
                    <br />
                    Sizes:
                    {foodItems[item].size.map((foodtsizes) => {
                      return <span key={foodtsizes} className="text-center text-gray-500 text-xs tracking-widest title-font mb-1  border  border-gray-300 mx-1 px-1"> {foodtsizes} </span>
                    })}


                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      {foodItems[item].title}
                    </h2>
                  
                    <p className="mt-1">₹{foodItems[item].price[0]}</p>
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
  let foods = await Food.find()
  let veg = {}
  for (let item of foods) {
    if (item.title in veg) {

      if (!veg[item.title].size.includes(item.size) && item.availableQty > 0) {
        veg[item.title].size.push(item.size)
      }
      if (!veg[item.title].type.includes(item.type) && item.availableQty > 0) {
        veg[item.title].type.push(item.type)
      }
    }
    else {
      veg[item.title] = JSON.parse(JSON.stringify(item))
      if (item.availableQty > 0) {
        veg[item.title].type = [item.type]
        veg[item.title].size = [item.size]
      }
    }
  }
  console.log(veg["Pizza"].type)
  // Pass data to the page via props
  return { props: { foodItems: JSON.parse(JSON.stringify(veg)) } }
}

// to avoid Error serializing `.food[0]` returned from `getServerSideProps` in "/veg". error we are using
// JSON.parse(JSON.stringify(food))
