import React,{useEffect,useState,useContext} from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
export default function Orders() {
    const router=useRouter()
    const [orders,setOrders]=useState([])
    const [fetchError,setFetchError]=useState(false)
    useEffect(()=>{
      const fetchOrders= async ()=>{
       const res=await fetch( `${process.env.NEXT_PUBLIC_HOST}/api/myorders`, {
              method: 'POST', // or 'PUT'
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({token:localStorage.getItem("token")}),
            })

            const finalRes = await res.json()
            if(finalRes.success){

              setOrders(finalRes.orders)
            }
            else{
              setFetchError(true)
            }
          
      }
      if(!localStorage.getItem("token")){
       router.push("/")
      }
      else {
        fetchOrders()
      }
       },[])

       
  return (
    <div className="container pt-24 mb-24">
      <h1 className="text-center font-semibold text-2xl mb-2">My Orders</h1>
      {fetchError? <h2 className="text-center font-semibold text-xl mb-2 mt-20">Internal Server Error. Please try again later!</h2>
     : <div className="flex flex-col lg:mx-40">
  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                Email
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((items)=>{
              return <tr key={items._id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
         
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {items.orderId}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {items.email}
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
  </div>
</div>}
    </div>
  )
}
