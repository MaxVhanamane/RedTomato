import React from 'react'
import Link  from 'next/link';
import { GrAddCircle } from "react-icons/gr";
import { BsImage } from "react-icons/bs";
import { BsFillEyeFill } from "react-icons/bs";
import Image from "next/image";

export default function DashboardSidebar() {
  return (
    <aside className="overflow-y-scroll h-full  shadow-md rounded-sm  sidebar w-60 fixed top-0 left-0 bg-gray-100  " aria-label="Sidebar">
   <div className="overflow-y-auto py-4 px-3 h-full bg-gray-50  ">
 
        <div className="flex-shrink-0 flex ">
       
          <span className="block h-8 w-auto text-white px-2 rounded-xl bg-red-500 font-bold text-xl">Red Tomato </span>
        </div>
      <ul className="space-y-2 mt-8">
         {/* <li >
            <a  className=" cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 ">
               <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75  group-hover:text-gray-900 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
               <span className="ml-3">Dashboard</span>
            </a>
         </li> */}
         
         <Link href="/myaccount">
         <li >
            <a  className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 ">
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">My Account</span>
            </a>
         </li>
         </Link>

          <Link href="/dashboard/additems">
         <li >
            <a  className=" cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 ">
            <GrAddCircle className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75  group-hover:text-gray-900 "/>
               <span className="flex-1 ml-3 whitespace-nowrap">Add Items</span>
            </a>
         </li>
         </Link>
         <Link href="/dashboard/viewall">
         <li >
            <a  className=" cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 ">
             
               <BsFillEyeFill className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75  group-hover:text-gray-900 "/>
               <span className="flex-1 ml-3 whitespace-nowrap">View all</span>
            </a>
         </li>
         </Link>
         {/* <Link href="/about">
         <li >
            <a  className=" cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 ">
        
               <GrAddCircle className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75  group-hover:text-gray-900 "/>
               <span className="flex-1 ml-3 whitespace-nowrap">About us</span>
            </a>
         </li>
         </Link> */}
      </ul>
   </div>

</aside>
  )
}
