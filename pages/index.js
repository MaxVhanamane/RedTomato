import Head from "next/head";
import React,{useState,useEffect} from "react";
import connectDb from './../middleware/mongoose';
import Food from './../models/foods';
import Link from 'next/link';
import Image from "next/image";
import dynamic from "next/dynamic";
import { RiSearchLine } from "react-icons/ri";

import PopularFoodItems from "../components/PopularFoodItems";


const SearchResults=dynamic(()=>import("../components/SearchResults"),{
  // ssr true will pre-render this component on the server If I make it false it will not pre-render on the server it will render on the client side
  ssr:true
})

export default function Home({ foodItems }) {
  const [allTypesOfFood,setAllTypesOfFood]=useState(foodItems)

  const [searchResult,setSearchResult]=useState([])

  const[searchTerm,setSearchTerm]=useState("")

  const[showSearch,setshowSearch]=useState(false)

  const [popularFoodItems,setPopularFoodItems]=useState([])

  useEffect(()=>{
    let arr=allTypesOfFood.filter((food)=>{
      return food.popularity==="high"
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





  
  return (
   <>
   <Head>
    <title>Red Tomato - Home</title>
    <meta name="description" content={ foodItems.length>0? foodItems.map((item) =>{
      return item.title
    } ):"We deliver Veg and Non veg food"} />
   </Head>
 <div className=" relative pt-[4rem] sm:pt-[4.75rem] lg:pt-6 md:pt-8 text-gray-400 focus-within:text-gray-600 ">
  <div style={{width:"100vw", height:"19vh",position:"relative"}} className="home_image">


  <Image src="/assets/small_screen_home.jpg" priority={true}  alt="home image" layout="fill" objectFit="cover"  className="small_screen" />
  <Image src="/assets/home5.jpg" priority={true}  alt="home image" layout="fill" objectFit="cover" className="large_screen"  />
  </div>


  <div className="flex items-center justify-center pt-16 lg:pt-6 md:pt-8 text-gray-400 w-full focus-within:text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  <RiSearchLine className="hidden md:block w-4 h-4 sm:w-5 sm:h-5 z-20 fixed  sm:-ml-[21rem] -ml-[11.5rem] pointer-events-none  "/>
  <input type="text" placeholder="Search" className="fixed border-none ring-2 ring-gray-300 focus:ring-gray-500 focus:ring-2
   bg-white rounded-lg sm:p-2 sm:w-96 p-[0.1rem]  sm:pl-[3rem] pl-[1rem]
   outline-none  shadow-neutral-300" onChange={handleSearch} />
 </div>
 </div>

{/* Search Results  */}
{/* I am importing SearchResults dynamically and I will render this component only when showSearch is true so that it will help us to reduce intial bundle size it will get this component from the server once showSearch becomes true */}
{showSearch?<SearchResults showSearch={showSearch} searchResult={searchResult}/>:null}

{/* Cards  */}
{!showSearch &&  <div className="md:hidden w-screen flex  justify-center items-center mt-[0.1rem] gap-[0.1rem] ">

<Link href="/veg">
<div style={{width:"100vw", height:"18vh",position:"relative" ,cursor:"pointer"}} className="shadow bg-gradient-to-r from-[#020b14] to-[#021e2a] ">
<h1 className="absolute top-0 left-0 z-10 font-bold text-xs py-0.5 px-1 text-white md:text-2xl bg-green-700 md:px-2 md:py-1"> Veg </h1>
            
<Image src="/assets/veg.png"  alt="veg food image" layout="fill" objectFit="cover" priority={true}  />
            
</div>
</Link>
<Link href="/nonveg">
<div style={{width:"100vw", height:"18vh",position:"relative",cursor:"pointer" }} className="shadow bg-gradient-to-r from-[#020b14] to-[#021e2a]"> 
 {/* #183e49 */}

<h1 className="absolute top-0 left-0 z-10 font-bold text-xs py-0.5 px-1 text-white md:text-2xl bg-red-600 md:px-2 md:py-1"> Non Veg </h1>


  
<Image src="/assets/nonveg.png"  alt="non veg food image" layout="fill" objectFit="cover" priority={true}  />


</div>
</Link>

</div>}
{/* Popular dishes  */}
{/* showSearch popularFoodItems */}
<PopularFoodItems showSearch={showSearch} popularFoodItems={popularFoodItems}/>

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


