import React,{useState,useEffect} from "react";
import Image from "next/image";
import connectDb from './../../middleware/mongoose';
import Food from './../../models/foods';
import Link from 'next/link';
import DashboardSidebar from './../../components/DashboardSidebar';
import {  toast } from 'react-toastify';
import { useRouter } from 'next/router';
export default function Viewall({ foodItems }) {
    const myLoader = ({ src, width, quality }) => {
        return `${src}?w=${width}&q=${quality || 100}`;
      };


      // Using useRouter we can fetch the updated data in getserverside props once the data is changed. here I am using it because 
      // when I delete an Item then I want the fresh data from the server.
      const router = useRouter();

      const refreshData = () => {
        router.replace(router.asPath);
      }


      useEffect(()=>{
        const fetchUser= async ()=>{
         const res=await fetch( `${process.env.NEXT_PUBLIC_HOST}/api/getuserdetails`, {
                method: 'POST', // or 'PUT'
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({tokenVal:localStorage.getItem("token")}),
              })
    
              const finalRes = await res.json()
              if( !(finalRes.success && finalRes.role==="admin")){
                localStorage.removeItem("user")
                localStorage.removeItem("token")
                localStorage.removeItem("role")
                router.push("/")
              }
              
            
        }
        let adminToken=localStorage.getItem("token")
        let role=localStorage.getItem("role")
    
        if(!(adminToken && role==="admin"))
        {
          localStorage.removeItem("user")
          localStorage.removeItem("token")
          localStorage.removeItem("role")
          router.push("/")
        }
        else{
          fetchUser()
        }
       
      
      },[router.query])


      const handleDelete=async(id)=>{

        const data = id;
     

        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/deletefooditem`, {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        const response = await res.json()
        if(response.success){
            toast.success('Item deleted successfully!', {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
 
              // calling the refreshData function to get the new food items data.
              refreshData();

      }
    }


  return (
    <>
   <style jsx global>{`
       footer{
        display:none;
       }
       #nav{
        display:none;
       }
      `}</style>
    <DashboardSidebar/>
    <section className="text-gray-600 body-font lg:ml-60">
    <div className=" sticky top-0 py-4 font-bold md:text-3xl text-2xl bg-[#f9fafb]  text-center shadow  text-gray-700 drop-shadow mb-8 z-10 "><h1 className="text-center mx-auto">All food items</h1></div>
    <div className="container  mx-auto  ">
        

          
      <div className="flex flex-wrap m-auto  justify-center space-x-2 ">
        {foodItems.map((item) => {

          return <div key={item._id} className=" mt-3 mb-8 mr-2 hover:shadow-xl hover:bg-gray-100 rounded-xl  antialiased">
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


<h2 className=" text-gray-900 title-font text-lg font-medium pl-1">
                {item.title}
              </h2>
              <p className="pl-1 text-gray-500 text-xs tracking-widest title-font mb-1 w-80 h-8 ">{ item.desc.slice(0,80)}...</p>
              <hr className="block bg-gray-400 h-0.5"/>
            <div className="flex mt-4">
              <p className=" pb-2 mt-1 pl-1">₹{item.price[0]}</p>
              <div className="flex ml-24 space-x-2 mb-2">
          <Link passHref href={`/dashboard/edititem/${item.slug}`}><button  className="  text-white bg-green-800 border-0  px-6 focus:outline-none hover:bg-green-900 rounded-md">
                    Edit</button></Link>
          <button onClick={()=>{handleDelete(item._id)}} className="  text-white bg-red-500 border-0  px-6 focus:outline-none hover:bg-red-600 rounded-md">
                    Delete</button>
                    </div>

                  </div>

            </div> 
         
        </div>
        })}

      </div>
    </div>
  </section>
  </>
  )
}

// This gets called on every request
export async function getServerSideProps() {
    // Fetch data from external API
    connectDb()
    let foods = await Food.find({})
   
    
    return { props: { foodItems:JSON.parse(JSON.stringify(foods)) } }
  }
