import React from 'react'
import Link from "next/link"
import Image from "next/image"
function SearchResults({showSearch,searchResult}) {
    const myLoader = ({ src, width, quality }) => {
        return `${src}?w=${width}&q=${quality || 75}`;
      };
  return (
    <>
    
{showSearch ? <div>
  
  <div className="text-center">
 <h2 className="font-semibold sm:text-3xl text-2xl mt-6 text-gray-800 mb-3">Search Results</h2>
 </div>
  <section className="text-gray-600 body-font mb-28 ">
        <div className="container px-5 py-2 mx-auto  ">
          <div className="flex flex-wrap m-auto gap-2 justify-center ">

 {searchResult.length===0&& <h2 className=" sm:text-xl text-lg mt-4 text-red-500">No results found.</h2>}


            {searchResult.map((item) => {

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
                    <span className={`${item.category==="veg" ? "text-green-600" :" text-red-500"}  text-xs tracking-widest title-font w-80   `}> { item.category}</span></p>
                  <hr className="block bg-gray-400 h-0.5"/>
                
                  <p className=" pb-2 mt-1">₹{item.price[0]}</p>
                </div> </a>
              </Link>
            </div>
            })}

          </div>
        </div>
      </section></div>:null}
    </>
  )
}

export default SearchResults
