import React,{useEffect} from 'react'
import { useRouter } from 'next/router';

import DashboardSidebar from './../../components/DashboardSidebar';

export default function Dashbord() {

  const router=useRouter()
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
</>
  )
}


