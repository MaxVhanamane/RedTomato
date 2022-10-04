import Head from "next/head";
import React,{useState,useEffect} from "react";
import connectDb from './../middleware/mongoose';
import Food from './../models/foods';
import Link from 'next/link';
import Image from "next/image";
import { RiSearchLine } from "react-icons/ri";



export default function Home({ foodItems }) {
  const [allTypesOfFood,setAllTypesOfFood]=useState(foodItems)
  const [searchResult,setSearchResult]=useState([])
  const[searchTerm,setSearchTerm]=useState("")
  const[showSearch,setshowSearch]=useState(false)
  const [popularFoodItems,setPopularFoodItems]=useState([])
  useEffect(()=>{
    let arr=allTypesOfFood.filter((el)=>{
      return el.popularity==="high"
    })
    setPopularFoodItems(arr)

  },[])

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResult([])
    setshowSearch(false)

    }

    else {

      const filterData = allTypesOfFood.filter(function (val) {
        if (val.title.toLowerCase().includes(searchTerm.toLowerCase()) ) {
          return val
        }
        // you have to add else statement else it will give warning in console that filter is not returning anything.
        else {
          return null
        }
      })
      setSearchResult(filterData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  function handleSearch(event) {
    setSearchTerm(event.target.value)
    setshowSearch(true)
  }





  const myLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 100}`;
  };
  return (
   <>
   <Head>
    <title>Red Tomato - Home</title>
    <meta name="description" content={ foodItems.length>0? foodItems.map((item) =>{
      return item.title
    } ):"We deliver Veg and Non veg food"} />
   </Head>
 <div className=" relative pt-[4rem] sm:pt-[4.75rem] lg:pt-6 md:pt-8 text-gray-400 focus-within:text-gray-600 ">
  <div style={{width:"100vw", height:"30vw",position:"relative"}}>


  <Image src="/assets/home.jpeg" priority={true}  alt="home image" layout="fill"  />
  </div>


  <div className="flex items-center justify-center pt-16 lg:pt-6 md:pt-8 text-gray-400 focus-within:text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  <RiSearchLine className="w-5 h-5 z-20 absolute  sm:-ml-[22rem] -ml-[11.5rem] pointer-events-none  "/>
  <input type="text" placeholder="Search" className="border-none ring-2 ring-gray-300 focus:ring-gray-500 focus:ring-2
   bg-white rounded-xl sm:p-2 sm:w-96 p-[0.1rem] w-50 sm:pl-[3rem] pl-[2rem]
   outline-none  shadow-neutral-300" onChange={handleSearch} />
 </div>
 </div>

{/* Search Results  */}

{showSearch && <div>
  
  <div className="text-center">
 <h1 className="font-semibold sm:text-3xl text-2xl mt-6 text-gray-800 mb-3">Search Results</h1>
 </div>
  <section className="text-gray-600 body-font mb-28 ">
        <div className="container px-5 py-2 mx-auto  ">
          <div className="flex flex-wrap m-auto  justify-center ">

 {searchResult.length===0&& <h1 className=" sm:text-xl text-lg mt-4 text-red-500">No results found.</h1>}


            {searchResult.map((item) => {

              return <div key={item._id} className=" mt-3 mr-2 hover:shadow-xl hover:bg-gray-100 rounded-xl  antialiased">
              <Link passHref href={`/product/${item.slug}`}><a className="block relative p-3  rounded-xl overflow-hidden">
                <Image className="rounded-xl"
                  loader={myLoader}
                  alt={item.title}
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
      </section></div>}

{/* Cards  */}
{!showSearch &&  <div className="md:hidden w-screen flex  justify-center items-center mt-[0.1rem] gap-[0.1rem] ">

<Link href="/veg">

<div style={{width:"100vw", height:"33vw",position:"relative" ,cursor:"pointer"}}>
<h1 className="absolute top-0 left-0 z-10 font-bold text-xs py-1 px-1 text-white md:text-2xl bg-green-700 md:px-2 md:py-1"> Veg </h1>
            
<Image src="/assets/carrotsalad.jpg"  alt="veg food image" layout="fill"  />
            
</div>
</Link>
<Link href="/nonveg">
<div style={{width:"100vw", height:"33vw",position:"relative",cursor:"pointer"}}>
<h1 className="absolute top-0 left-0 z-10 font-bold text-xs py-1 px-1 text-white md:text-2xl bg-red-700 md:px-2 md:py-1"> Non Veg </h1>


  
<Image src="/assets/butterchicken.jpg"  alt="non veg food image" layout="fill"  />


</div>
</Link>

</div>}
{/* Popular dishes  */}

{!showSearch && <div>
 <div className="lg:w-1/2 w-full m-8 lg:mb-0">
 <h1 className="sm:text-3xl text-2xl font-medium title-font m-2 text-gray-900">Our best-selling dishes</h1>
 <div className="h-1 mx-2 w-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded"></div>
 </div>
  

    <section className="text-gray-600 body-font mb-28">
        <div className="container px-5 py-2 mx-auto  ">
          <div className="flex flex-wrap m-auto  justify-center gap-6">

            {popularFoodItems.map((item) => {

              return <div key={item._id} className=" mt-3 mr-2 hover:shadow-xl hover:bg-gray-100 rounded-xl  antialiased">
                <Link passHref href={`/product/${item.slug}`}><a className="block relative p-3  rounded-xl overflow-hidden">
                  <Image className="rounded-xl"
                    loader={myLoader}
                    alt={item.title}
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
      </section>

      </div>}

    </>
    
  );
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  connectDb()
  let foods = await Food.find({})
 
  
  return { props: { foodItems:JSON.parse(JSON.stringify(foods)) } }
}

// {/* <div className=" relative pt-20 lg:pt-6 md:pt-8">
// {/* <Image src="/assets/ind.jpg" width={500} height={100}  className="w-auto h-1/2 "  />
//  */}
// <Image src="/assets/home.jpeg" 
// width={500} 
// height={100}  
// quality={100}
//   />
// <input type="text" placeholder="Search" className="bg-white rounded-xl p-2 w-96 pl-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 outline-none  shadow-neutral-300" />
// <div className="text-center">
// <h1 className="font-bold text-3xl mt-4 text-orange-500">Our most popular foods.</h1>
// </div>
// </div> */}

