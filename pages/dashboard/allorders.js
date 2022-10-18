import React,{useEffect,useState} from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Orders from '../../models/orders';
import connectDb from './../../middleware/mongoose';
import DashboardSidebar from './../../components/DashboardSidebar';
import Head from "next/head";
import { RiDashboardFill } from "react-icons/ri";

export default function AllOrders({allOrders}) {
    const router=useRouter()
    const [orders,setOrders]=useState(allOrders)
  


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
          router.push("/")
        }
        else{
          fetchUser()
        }
       
      
        
      
      
      },[router.query])

       
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
           <Head>
    <title>Dashboard - All orders</title>
    <meta name="description" content="View all the orders received" />
   </Head>
    <DashboardSidebar/>

    <div className="lg:ml-60 sticky top-0  z-10">
    <div className=" sticky top-0 py-3 font-bold md:text-3xl text-2xl bg-red-500 text-center shadow  text-gray-50 drop-shadow mb-8 z-10 ">
    <RiDashboardFill className="absolute ml-4 text-4xl hidden lg:block"/> <span className="absolute ml-16 text-lg text-center top-4 hidden lg:block">Dashboard</span>
      <h1 className="text-center mx-auto">All orders</h1>
      </div>
      </div>
    
    <div className=" lg:pt-2 pt-8 mb-24 lg:ml-60 p-4">
      <div className="flex flex-col lg:mx-16">
  {orders.length>0 ?<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-white border-b">
            <tr>
              {/* <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Sr No.
              </th> */}
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Order Id
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Status
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Amount
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Name
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Email
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Phone
              </th>
            
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            { orders.map((items)=>{
              return <tr key={items._id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
         
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {items.orderId}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {items.status}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {items.amount}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {items.name}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {items.email}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {items.phone}
              </td>
          
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                <Link href={`/order?id=${items.orderId}`}><a className="text-blue-700">View Details</a></Link>
              </td>
            </tr>
            })}
            
          </tbody>
        </table>
      </div>
    </div>
  </div>: <h1 className="text-center mt-6 text-md sm:text-xl"> No orders found!</h1>}
</div>
    </div>
    </>
  )
}

// This gets called on every request
export async function getServerSideProps() {
    // Fetch data from external API
    connectDb()
    let orders = await Orders.find({status:"paid"})
   
    
    return { props: { allOrders:JSON.parse(JSON.stringify(orders)) } }
  }
