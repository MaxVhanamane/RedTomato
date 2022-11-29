import React from 'react'
import Link from "next/link"
import Image from "next/image"
function PopularFoodItems({showSearch,popularFoodItems}) {
    const myLoader = ({ src, width, quality }) => {
        return `${src}?w=${width}&q=${quality || 75}`;
      };
  return (<>
    {!showSearch ? <div>
        
        <div className="lg:w-1/2 w-full m-8 lg:mb-0">
        <h1 className="sm:text-3xl text-2xl font-medium title-font m-2 text-gray-900">Our best-selling dishes</h1>
        <div className="h-1 mx-2 w-20 bg-gradient-to-r from-red-400 to-red-500 rounded"></div>
        </div>
         
       
           <section className="text-gray-600 body-font mb-28">
               <div className="container px-5 py-2 mx-auto  ">
                 <div className="flex flex-wrap m-auto gap-2 justify-center ">
       
                   {popularFoodItems.map((item) => {
       
                     return <div key={item._id} className=" mt-3 hover:shadow-xl hover:bg-gray-100 rounded-xl  antialiased">
                       <Link passHref href={`/product/${item.slug}`}><a className="block relative p-3  rounded-xl overflow-hidden">
                         <Image className="rounded-xl"
                           loader={myLoader}
                           alt={item.title}
                           src={item.img}
                           width={320}
                           height={250}
                           layout="responsive"
                           objectFit='cover'
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
                           <p className="  text-gray-500 text-xs tracking-widest title-font mb-1 w-80   ">{ item.desc.slice(0,80)}...</p>
                           <p className="  text-gray-500 text-xs tracking-widest title-font mb-2 w-80   "> category: 
                           <span className={`${item.category==="veg" ? "text-green-600" :" text-red-500"}  text-xs tracking-widest title-font font-semibold w-80   `}> { item.category}</span></p>
                           <hr className="block bg-gray-400 h-0.5"/>
                         
                           <p className=" pb-2 mt-1">₹{item.price[0]}</p>
                         </div> </a>
                       </Link>
                     </div>
                   })}
       
                 </div>
               </div>
             </section>
       
             </div>:null}
             </>
  )
}

export default PopularFoodItems
