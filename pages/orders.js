import React,{useEffect,useState,useContext} from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from "next/head";
import Order from './../models/orders';
import connectDb from './../middleware/mongoose';

export default function Orders({myOrders}) {
    const router=useRouter()
    // Sorting orders using dates
   let sortOrders= myOrders.sort(function(a,b){
    
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    const [orders,setOrders]=useState(sortOrders)
    useEffect(()=>{

      if(!localStorage.getItem("token")){
       router.push("/")
      }
    
       },[])

       
  return (
    <>
      <Head>
    <title>My orders</title>
    <meta name="description" content="Orders page "/>
   </Head>
    <div className="container pt-24 mb-24">
      <h1 className="text-center font-bold  text-gray-700 text-2xl mb-4">My Orders</h1>
      <div className="flex flex-col lg:mx-40">
  {orders.length>0 ?<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table className="min-w-full table-fixed">
          <thead className="bg-white border-b">
            <tr>
           
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Order Id
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Food Items
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Order Date
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Total
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            { orders.map((items)=>{
              let foods=Object.keys(items.products)
              let foodItemsToDisplay
              if(foods.length==1){
                foodItemsToDisplay=foods[0]
              }
              else if (foods.length>1){
                foodItemsToDisplay=`${foods[0]},${foods[1]},etc.`
              }
              return <tr key={items._id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {items.orderId}
              </td>
              <td className="text-sm text-gray-900 font-light  px-6  py-4  whitespace-nowrap">
              {foodItemsToDisplay}
              </td>
              <td className="text-sm text-gray-900 font-light  px-6  py-4  whitespace-nowrap">
              {new Date(items.createdAt).toLocaleDateString('en-GB')}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {items.amount}
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
  </div>: <h3 className="text-center text-red-500 mt-6 text-md sm:text-xl"> No orders found!</h3>}
</div>
    </div>
    </>
  )
}

// This gets called on every request
export async function getServerSideProps(context) {
  // Fetch data from external API
  connectDb()
  let orders = await Order.find({email:context.query.email})

  return { props: { myOrders: JSON.parse(JSON.stringify(orders)) } }
}
